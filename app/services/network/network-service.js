export let serviceName = 'network';
export default /*@ngInject*/ function network(
  $interval,
  $q,
  $window,
  channels,
  notifications,
  R,
  state,
  telehash
) {
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

    // if channel already exists, this invite packet indicates acceptance
    let existingChannel = state.cloud.channels
      .get([channel.id, 'channelInfo']);

    let statusId = 1; //online

    let receivedInvite = !existingChannel;

    return state.save(
        state.cloud.contacts,
        [contactInfo.id, 'userInfo'],
        contactInfo
      )
      .then(() => state.save(
        state.cloud.contacts,
        [contactInfo.id, 'statusId'],
        statusId
      ))
      .then(() => state.save(
        state.cloud.channels,
        [channel.id, 'channelInfo'],
        channel
      ))
      .then(() => {
        if (receivedInvite) {
          return state.save(
            state.cloud.channels,
            [channel.id, 'receivedInvite'],
            true
          );
        }

        return state.remove(
          state.cloud.channels,
          [channel.id, 'sentInvite']
        );
      });
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

  let handleMessage = function handleMessage(messagePayload, messageMetadata) {
    let messageContent = messagePayload.c;
    let receivedLogicalClock = messagePayload.l;
    let sentTime = messageMetadata.sentTime;
    let receivedTime = messageMetadata.receivedTime;
    let senderId = messageMetadata.senderId;
    let channelId = messageMetadata.channelId;

    let messageId = sentTime + '-' + senderId;

    let message = {
      id: messageId,
      //TODO: find main contact endpoint id from sender userId
      // when using multi-endpoint contacts
      senderId: senderId,
      receivedTime: receivedTime,
      sentTime: sentTime,
      logicalClock: receivedLogicalClock,
      content: messageContent
    };

    let channelCursor = state.cloud.channels.select(
      [channelId]
    );

    let messagesCursor = state.cloud.messages.select(
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
        messagesCursor,
        [messageId, 'messageInfo'],
        message
      ))
      .then(() => state.save(
        channelCursor,
        ['latestMessageId'],
        messageId
      ))
      .then(() => {
        let activeViewId =
          state.cloud.navigation.get(['activeViewId']);
        if (activeViewId === channelId &&
          channelCursor.get(['viewingLatest'])) {
          return $q.when();
        }

        let contactName = state.cloud.contacts.get(
          [senderId, 'userInfo', 'displayName']
        );

        let updatingUnreadPointer =
          !channelCursor.get(['unreadMessageId']) ?
            state.save(
              channelCursor,
              ['unreadMessageId'],
              messageId
            ) :
            $q.when();

        return updatingUnreadPointer
          .then(() => notifications.notify(channelId));
      });
  };

  let listen = function listen(channelInfo, session = activeSession) {
    let handlePacket = (error, packet, channel, callback) => {
      let handledPacket = () => {
        if (error) {
          return $q.reject(error);
        }

        let senderId = packet.from.hashname;
        let channelId = channel.type.substr(1); //removes leading underscore
        let receivedTime = Date.now();
        let sentTime = packet.js.t;

        let ackPayload = packet.js.a;
        let invitePayload = packet.js.i;
        let statusPayload = packet.js.s;
        let messagePayload = packet.js.m;

        let messageMetadata = {
          senderId,
          channelId,
          sentTime,
          receivedTime
        };

        callback(true);
        channel.send({js: {a: {
          s: sentTime,
          r: receivedTime
        }}});

        if (ackPayload) {
          return $q.when();
        } else if (invitePayload) {
          return handleInvite(invitePayload);
        } else if (statusPayload !== undefined) {
          return handleStatus(statusPayload, senderId);
        } else if (messagePayload) {
          return handleMessage(messagePayload, messageMetadata);
        } else {
          return $q.reject(
            'Unrecognized packet format: ' + JSON.stringify(packet.js)
          );
        }
      };

      return handledPacket();
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
      let sendingMessage = $q.defer();

      let handleAck = (error, packet, channel, callback) => {
        if (error) {
          return sendingMessage.reject(error);
        }

        let ackPayload = packet.js.a;
        if (!ackPayload) {
          return sendingMessage.reject('Unrecognized message ack format');
        }

        callback(true);
        return sendingMessage.resolve(ackPayload);
      };

      try {
        checkSession(session);
        session.start(
          channelInfo.contactIds[0],
          channelInfo.id,
          {js: payload},
          handleAck
        );
      } catch(error) {
        sendingMessage.reject(error);
      }

      return sendingMessage.promise;
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
      i: userInfo,
      t: Date.now()
    };

    return send(inviteChannel, payload);
  };

  let sendStatus = function sendStatus(contactId, statusId) {
    let userId = state.cloud.identity.get().userInfo.id;
    let contactChannel = channels.createContactChannel(userId, contactId);

    let contactCursor = state.cloud.contacts.select([contactId]);

    let previousContactStatusId = contactCursor.get(['statusId']);

    if (previousContactStatusId === undefined) {
      return $q.when();
    }

    let payload = {
      s: statusId,
      t: Date.now()
    };

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

    let handleMessageAck = (ack) => {
      let sentTime = ack.s;
      let receivedTime = ack.r;

      let userId = state.cloud.identity.get().userInfo.id;
      let messageId = sentTime + '-' + userId;

      let message = {
        id: messageId,
        //TODO: find main contact userId from sender userId for multi-signon
        senderId: userId,
        receivedTime: receivedTime,
        sentTime: sentTime,
        logicalClock: logicalClock,
        content: messageContent
      };
      let messagesCursor = state.cloud.messages.select([channelInfo.id]);

      return state.save(
        messagesCursor,
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

    let payload = {
      m: {
        c: messageContent,
        l: logicalClock
      },
      t: Date.now()
    };

    return send(channelInfo, payload)
      .then(handleMessageAck)
      .catch((error) =>
        handleSendTimeout(error, contactId, previousContactStatusId)
      );
  };

  let initialize = function initializeNetwork() {
    let deferredSession = $q.defer();

    let keypair = state.cloud.network.get(['networkInfo']).keypair;

    let telehashOptions = keypair ? { id: keypair } : {};

    try {
      telehash.init(telehashOptions,
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
      let networkInfo = {
        id: telehashSession.hashname,
        keypair: telehashSession.id
      };

      activeSession = telehashSession;
      //DEBUG
      window.tocSession = activeSession;

      listen({id: channels.INVITE_CHANNEL_ID});

      return networkInfo;
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
