export let serviceName = 'network';
export default /*@ngInject*/ function network(
  $interval,
  $q,
  $window,
  channels,
  contacts,
  notifications,
  messages,
  R,
  state,
  time,
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
    return contacts.saveReceivedInvite(invitePayload);
  };

  let handleProfile = function handleProfile(profilePayload) {
    return contacts.saveReceivedProfile(profilePayload);
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
    return messages.saveReceivedMessage(messagePayload, messageMetadata);
  };

  let listen = function listen(channelInfo, session = activeSession) {
    let handlePacket = (error, packet, channel, callback) => {
      let handledPacket = () => {
        if (error) {
          return $q.reject(error);
        }

        let senderId = packet.from.hashname;
        let channelId = channel.type.substr(1); //removes leading underscore
        let receivedTime = time.getTime();
        let sentTime = packet.js.t;

        let ackPayload = packet.js.a;
        let invitePayload = packet.js.i;
        let profilePayload = packet.js.p;
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
        } else if (profilePayload) {
          return handleProfile(profilePayload);
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

  let sendInvite = function sendInvite(channelInfo, userInfo) {
    let payload = {
      i: userInfo,
      t: time.getTime()
    };

    return send(channelInfo, payload);
  };

  let sendProfile = function sendProfile(channelInfo, userInfo) {
    let payload = {
      p: userInfo,
      t: time.getTime()
    };

    return send(channelInfo, payload);
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
      t: time.getTime()
    };

    return send(contactChannel, payload)
      .catch((error) =>
        handleSendTimeout(error, contactId, previousContactStatusId)
      );
  };

  let sendMessage = function sendMessage(channelInfo, messageInfo) {
    let contactId = channelInfo.contactIds[0];

    let previousContactStatusId = state.cloud.contacts
      .get([contactId, 'statusId']);

    if (previousContactStatusId === undefined) {
      return $q.when();
    }

    let payload = {
      m: {
        c: messageInfo.content,
        l: messageInfo.logicalClock
      },
      t: messageInfo.sentTime
    };

    return send(channelInfo, payload)
      .then(handleMessageAck);
  };

  let initialize = function initializeNetwork() {
    let deferredSession = $q.defer();

    let keypair = state.cloud.network.get(['networkInfo', 'keypair']);

    let saveUserInfo = (networkInfo) => {
      let userInfo = {
        version: 1,
        id: networkInfo.id
      };

      return state.save(state.cloud.identity, ['userInfo'], userInfo);
    };

    //Don't save network info if already saved
    let saveNetworkInfo = (networkInfo) => keypair ?
      $q.when() :
      state.save(state.cloud.network, ['networkInfo'], networkInfo)
        .then(saveUserInfo);

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

    let startNetwork = (telehashSession) => {
      let networkInfo = {
        id: telehashSession.hashname,
        keypair: telehashSession.id
      };

      activeSession = telehashSession;
      //DEBUG
      window.tocSession = activeSession;

      listen({id: channels.INVITE_CHANNEL_ID});

      return networkInfo;
    };

    return deferredSession.promise
      .then(startNetwork)
      .then(saveNetworkInfo);
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
    sendProfile,
    sendStatus,
    sendMessage,
    initialize,
    destroy
  };

  $window.tocNetwork = networkService;
  return networkService;
}
