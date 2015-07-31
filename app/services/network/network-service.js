export default function network($q, $window, $interval, R, state, telehash,
  notification, channels) {
  let activeSession;

  let checkSession = function checkSession(session) {
    if (session) {
      return;
    }

    throw new Error('network: no active session');
  };

  let handleInvite = function handleInvite(invitePayload) {
    let contactInfo = invitePayload;

    let userId =
      state.cloud.identity.get(['userInfo']).id;

    let channel = channels.createContactChannel(userId, contactInfo.id);

    let existingChannel = state.cloud.channels.
      .get([channel.id, 'channelInfo']);

    let statusId = 1; //online

    channel.pendingAccept = !existingChannel;

    return state.save(
        state.cloud.channels,
        [channel.id, 'channelInfo'],
        channel
      )
      .then(() => state.save(
        state.cloud.contacts,
        [contactInfo.id, 'userInfo'],
        contactInfo
      ))
      .then(() => state.save(
        state.cloud.contacts,
        [contactInfo.id, 'statusId'],
        statusId
      ));
  };

  let handleStatus = function handleStatus(statusPayload, contactId) {
    let statusId = statusPayload;

    let contactCursor = state.cloud.contacts
      .select([contactId]);

    let currentContactStatus = contactCursor.get(['statusId']);

    if (currentContactStatus === statusId) {
      return $q.when();
    }

    return state.save(
      state.cloud.contacts,
      [contactId, 'statusId'],
      statusId
    );
  };

  let handleMessage = function handleMessage(messagePayload, sentTime,
    receivedTime, contactId, channelId) {
    let messageId = sentTime + '-' + contactId;

    let messageContent = messagePayload.c;
    let receivedLogicalClock = messagePayload.l;

    let message = {
      id: messageId,
      //TODO: find main contact endpoint id from sender userId
      // when using multi-endpoint contacts
      sender: contactId,
      receivedTime: receivedTime,
      sentTime: sentTime,
      logicalClock: receivedLogicalClock,
      content: messageContent
    };

    let channelCursor = state.cloud.channels.select(
      [channelId]
    );

    let existingLogicalClock = channelCursor.get('logicalClock');

    let currentLogicalClock = receivedLogicalClock >= existingLogicalClock ?
      receivedLogicalClock : existingLogicalClock;

    return state.save(
        channelCursor,
        ['logicalClock'],
        currentLogicalClock + 1
      )
      .then(() => state.save(
        channelCursor,
        ['messages', messageId, 'messageInfo'],
        message
      ))
      .then(() => {
        //TODO: implement with new unread indicator

        // let activeChannelId =
        //   state.cloud.network.get(['activeChannelId']);
        // if (activeChannelId === channelId &&
        //   channelCursor.get(['viewingLatest'])) {
        //   return $q.when();
        // }

        let contactName = state.cloud.contacts.get(
          [contactId, 'userInfo', 'displayName']
        );

        return notification.success(
          message.content,
          contactName + ' just said:'
        );
      });
  };

  let listen = function listen(channelInfo, session = activeSession) {
    let handlePacket = (error, packet, channel, callback) => {
      let handledPacket = () => {
        if (error) {
          return $q.reject(error);
        }

        callback(true);
        channel.send({js: {a: {
          s: packet.from.sentAt,
          r: packet.from.recvAt
        }}});

        if (packet.js.a !== undefined) {
          return $q.when();
        } else if (packet.js.i !== undefined) {
          return handleInvite(packet.js.i);
        } else if (packet.js.s !== undefined) {
          return handleStatus(packet.js.s, packet.from.hashname);
        } else if (packet.js.m !== undefined) {
          return handleMessage(
            packet.js.m,
            packet.from.sentAt,
            packet.from.recvAt,
            packet.from.hashname,
            channel.type.substr(1) //remove leading underscore
          );
        } else {
          return $q.reject(
            'Unrecognized packet format: ' + JSON.stringify(packet.js)
          );
        }
      };

      return handledPacket()
        .catch((error) => notification.error(error, 'Network Listen Error'));
    };

    try {
      checkSession(session);
      let listenResult = session.listen(channelInfo.id, handlePacket);
      return $q.when(listenResult);
    } catch(error) {
      return $q.reject(error);
    }
  };

  let send =
    function send(channelInfo, payload, session = activeSession) {
      let sentMessage = $q.defer();

      let handleAcknowledgement = (error, packet, channel, callback) => {
        if (error) {
          return sentMessage.reject(error);
        }

        callback(true);
        let acknowledgement = packet.js.a;
        if (acknowledgement) {
          return sentMessage.resolve(acknowledgement);
        } else {
          channel.send({js: {a: {
            s: packet.from.sentAt,
            r: packet.from.recvAt
          }}});
          return sentMessage.resolve(packet.from.sentAt);
        }
      };

      try {
        checkSession(session);
        session.start(
          channelInfo.contactIds[0],
          channelInfo.id,
          {js: payload},
          handleAcknowledgement
        );
      } catch(error) {
        sentMessage.reject(error);
      }

      return sentMessage.promise;
    };

  let handleSendTimeout =
    function handleSendTimeout(error, contactId, contactStatusId) {
      if (error !== 'timeout') {
        return $q.reject(error);
      }

      let contactCursor = state.cloud.contacts
        .select([contactId]);

      // do not change status back to offline if contact was already offline
      // or if contact status has been updated since message was sent
      let currentContactStatusId = contactCursor.get(['statusId']);
      if (currentContactStatusId === 0 ||
        currentContactStatusId !== contactStatusId) {
        return $q.reject(error);
      }

      return state.save(
        state.cloud.contacts,
        [contactId, 'statusId'],
        0
      );
    };

  let sendInvite = function sendInvite(contactId, userInfo) {
    let inviteChannel = {
      id: channels.INVITE_CHANNEL_ID,
      contactIds: [contactId]
    };

    let payload = {
      i: userInfo
    };

    return send(inviteChannel, payload);
  };

  let sendStatus = function sendStatus(contactId, statusId) {
    let userId = state.cloud.identity.get().userInfo.id;
    let contactChannel = channels.createContactChannel(userId, contactId);

    let payload = {
      s: statusId
    };

    let contactCursor = state.cloud.contacts.select([contactId]);

    let previousContactStatusId = contactCursor.get(['statusId']);

    if (previousContactStatusId === undefined) {
      return $q.when();
    }

    return send(contactChannel, payload)
      .catch((error) =>
        handleSendTimeout(error, contactId, previousContactStatusId)
      );
  };

  let sendMessage = function sendMessage(channelInfo, messageContent,
    logicalClock) {
    if (!messageContent || !logicalClock) {
      return $q.reject('Invalid message format.');
    }

    let payload = {
      m: {
        c: messageContent,
        l: logicalClock
      }
    };

    let handleMessageAck = (acknowledgement) => {
      let sentTime = acknowledgement.s;
      let receivedTime = acknowledgement.r;

      let userId = state.cloud.identity.get().userInfo.id;
      let messageId = sentTime + '-' + userId;

      let message = {
        id: messageId,
        //TODO: find main contact userId from sender userId for multi-signon
        sender: userId,
        receivedTime: receivedTime,
        sentTime: sentTime,
        logicalClock: logicalClock,
        content: messageContent
      };

      return state.save(
        state.cloud.channels.select(
          [channelInfo.id, 'messages']
        ),
        [messageId, 'messageInfo'],
        message
      );
    };

    let contactId = channelInfo.contactIds[0];

    let previousContactStatusId = state.cloud.contacts
      .select([contactId]).get(['statusId']);

    if (previousContactStatusId === undefined) {
      return $q.when();
    }

    return send(channelInfo, payload)
      .then(handleMessageAck)
      .catch((error) =>
        handleSendTimeout(error, contactId, previousContactStatusId)
      );
  };

  let initialize = function initializeNetwork(keypair) {
    let deferredSession = $q.defer();

    let telehashKeypair = {};
    if (keypair) {
      telehashKeypair.id = keypair;
    }

    try {
      telehash.init(telehashKeypair,
        function initializeTelehash(error, telehashSession) {
          if (error) {
            return deferredSession.reject(error);
          }

          return deferredSession.resolve(telehashSession);
        }
      );
    } catch(error) {
      return $q.reject(error);
    }

    return deferredSession.promise.then((telehashSession) => {
      let sessionInfo = {
        id: telehashSession.hashname,
        keypair: telehashSession.id
      };

      activeSession = telehashSession;
      //DEBUG
      window.tocSession = activeSession;

      listen({id: channels.INVITE_CHANNEL_ID});

      let existingChannels = state.cloud.channels.get();

      R.pipe(
        R.values,
        R.map(R.prop('channelInfo')),
        R.forEach(listen)
      )(existingChannels);

      return sessionInfo;
    });
  };

  let destroy = function destroyNetwork() {
    //FIXME: cleanup isnt thorough enough, some telehash console errors remain
    // return destroyChannels().then(() => {
    //   // brute force stop telehash networking, alternative is to reload page...
    //   R.pipe(
    //     R.keys,
    //     R.forEach((key) => {
    //       delete activeSession[key];
    //     })
    //   )(activeSession);
    //
    //   activeSession = undefined;
    //
    //   return $q.when();
    // });
  };

  let networkService = {
    listen,
    send,
    sendInvite,
    sendStatus,
    sendMessage,
    initialize,
    destroy
  };

  $window.tocNetwork = networkService;
  return networkService;
}
