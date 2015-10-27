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
  const TOC_SEEDS = {
    "876d5ce8956009afc010fc908ca29617a444db660cd5598d81bb6a5a2635ba7a": {
      "paths": [
        {
          "type": "http",
          "http": "https://seed.toc.im:42424"
        }
      ],
      "parts": {
        "2a": "a9b3da6d514c8aeb1cc001f5423dbf80f0c523a000b1087286fd1b18168d9e3e",
        "1a": "fc1c470beb1ca7fdb6ecf7a7e3b542e087e0e7705d91666e7a124bc2aeeea9bf"
      },
      "keys": {
        "2a": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1Lb4LwKUW1D3XI/jK5cBtbO17e/6oSD5myO/wYOIyRcJpDgRe////94ugsPGO/FtDnNdWTJ8/bpRGkxnlHadSGA0K3hukx+SOSdddzB/wAp86l0eCuiIBeDfnBYvxC4KmiRHFHMXSRYq2HWSzH2Knz65g/6VI/Qe/F4M8+A19Wxq1RBDtLcigJtkUdJ/y4TUdSwAPaM/mcQFwjCqssC8sgH6LzqPP43+yloxqG5Hx4IsWgcnBzaCQh8yYbP04nH7fd19gPXyWCSjo3CdSwnvfCHiU/eulXT1wubMhR0ZI/XrF3fC8tglgAOsqSxBdwpWo7iZzrTX2sxV8QWnZ5xsmwIDAQAB",
        "1a": "BO7ZnXZ6VorqlSXhXLfkHtPwctqM53eL3WRqRX/RHGVB2QuTYwLMnw=="
      }
    }
  };

  let setSeeds = function setSeeds(seeds) {
    state.save(state.cloud.network, ['networkInfo', 'seeds'], seeds);
  };

  $window.tocSetSeeds = setSeeds;

  let activatingSession = $q.defer();
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
    let contactCursor = state.cloud.contacts.select([contactId]);
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

        let ackPayload = packet.js.a;
        let invitePayload = packet.js.i;
        let profilePayload = packet.js.p;
        let statusPayload = packet.js.s;
        let messagePayload = packet.js.m;

        callback(true);

        let sendAck = (ackPayload) => {
          channel.send({js: {a: ackPayload}});
        };

        if (ackPayload) {
          return handleStatus(1, senderId);
        } else if (invitePayload) {
          sendAck({});
          return handleInvite(invitePayload);
        } else if (profilePayload) {
          sendAck({});
          return handleProfile(profilePayload);
        } else if (statusPayload !== undefined) {
          sendAck({});
          return handleStatus(statusPayload, senderId);
        } else if (messagePayload) {
          let receivedTime = time.getTime();
          let sentTime = packet.js.t;

          let ackPayload = {
            s: sentTime,
            r: receivedTime
          };
          sendAck(ackPayload);

          let messageMetadata = {
            senderId,
            channelId,
            sentTime,
            receivedTime
          };
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
      // if session is not active, defer listening until it becomes active
      if (error.message === 'network: no active session') {
        return activatingSession.promise.then((newSession) => {
          let listenResult = newSession.listen(channelInfo.id, handlePacket);
          return $q.when(listenResult);
        });
      }
      return $q.reject(error);
    }
  };

  let send =
    function send(channelInfo, payload, session = activeSession) {
      let sendingPacket = $q.defer();

      let handleAck = (error, packet, channel, callback) => {
        if (error) {
          return sendingPacket.reject(error);
        }

        let ackPayload = packet.js.a;
        if (!ackPayload) {
          return sendingPacket.reject('Unrecognized message ack format');
        }

        callback(true);
        let senderId = packet.from.hashname;
        handleStatus(1, senderId);
        return sendingPacket.resolve(ackPayload);
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
        sendingPacket.reject(error);
      }

      return sendingPacket.promise;
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
      i: userInfo
    };

    return send(channelInfo, payload);
  };

  let sendProfile = function sendProfile(channelInfo, userInfo) {
    let payload = {
      p: userInfo
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
      s: statusId
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

    return send(channelInfo, payload);
  };

  let initialize = function initializeNetwork() {
    let existingSeeds = state.cloud.network.get(['networkInfo', 'seeds']);

    if (!existingSeeds) {
      setSeeds(TOC_SEEDS);
    }
    $window.tocSeeds = existingSeeds || TOC_SEEDS;

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

    let startNetwork = (telehashSession) => {
      let networkInfo = {
        id: telehashSession.hashname,
        keypair: telehashSession.id
      };

      activeSession = telehashSession;
      //DEBUG
      $window.tocSession = activeSession;

      listen({id: channels.INVITE_CHANNEL_ID});

      activatingSession.resolve(activeSession);

      return networkInfo;
    };

    let connectToNetwork = () => {
      let deferredSession = $q.defer();

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

      return deferredSession.promise;
    };

    // don't block on network connection attempt if user already initialized
    if (keypair) {
      let attemptBackgroundConnection = () => {
        return connectToNetwork()
          .then(startNetwork)
          .catch((error) => {
            // abort if network connection fails for reasons other than offline
            if (error !== 'offline') {
              return $q.reject(error);
            }
            return attemptBackgroundConnection();
          });
      };
      attemptBackgroundConnection();

      return $q.when();
    }

    return connectToNetwork()
      .then(startNetwork)
      .then(saveNetworkInfo)
      .catch((error) => {
        if (error === 'offline') {
          return $q.reject('New accounts cannot be created offline');
        }
        return $q.reject(error);
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
    sendProfile,
    sendStatus,
    sendMessage,
    initialize,
    destroy
  };

  $window.tocNetwork = networkService;
  return networkService;
}
