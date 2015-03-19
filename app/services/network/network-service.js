export default function network($q, $log, $interval, R, state, telehash) {
  const NETWORK_PATH = ['network'];
  const NETWORK_CURSORS = {
    synchronized: state.synchronized.tree.select(NETWORK_PATH)
  };

  const CHANNEL_ID_PREFIX = 'toc-';
  const INVITE_CHANNEL_ID = CHANNEL_ID_PREFIX + 'invite';

  let activeSession;

  let checkSession = function checkSession(session) {
    if (session) {
      return;
    }

    throw 'network: no active session';
  };

  let generateContactChannelId =
    function generateContactChannelId(userId, contactId) {
      let channelId = userId > contactId ?
        userId + '-' + contactId :
        contactId + '-' + userId;

      return CHANNEL_ID_PREFIX + channelId;
    };

  let generateGroupChannelId =
    function generateGroupChannelId(userId, channelName) {
      let channelId = userId + channelName;

      return CHANNEL_ID_PREFIX + channelId;
    };

  let createContactChannel = function createContactChannel(userId, contactId) {
    let channelId = generateContactChannelId(userId, contactId);

    let channel = {
      id: channelId,
      contactIds: [contactId]
    };

    return channel;
  };

  let handleInvite = function handleInvite(invitePayload) {
    let contactInfo = invitePayload;

    let userId =
      state.synchronized.tree.select(['identity', 'userInfo']).get().id;

    let channel = createContactChannel(userId, contactInfo.id);

    let existingChannel = NETWORK_CURSORS.synchronized
      .get(['channels', channel.id, 'channelInfo']);

    let statusId = 1; //online

    channel.pendingHandshake = !existingChannel;

    return state.save(
        NETWORK_CURSORS.synchronized,
        ['channels', channel.id, 'channelInfo'],
        channel
      )
      .then(() => state.save(
        state.synchronized.tree.select(['contacts']),
        [contactInfo.id, 'userInfo'],
        contactInfo
      ))
      .then(() => state.save(
        state.synchronized.tree.select(['contacts']),
        [contactInfo.id, 'statusId'],
        statusId
      ));
  };

  let handleStatus = function handleStatus(statusPayload, contactId) {
    let statusId = statusPayload;

    return state.save(
      state.synchronized.tree.select(['contacts']),
      [contactId, 'statusId'],
      statusId
    );
  };

  let handlePayload =
    function handlePayload(error, packet, channel, callback) {
      if (error) {
        return $log.error(error);
      }

      callback(true);
      channel.send();

      if (packet.js.i) {
        return handleInvite(packet.js.i);
      } else if (packet.js.s) {
        return handleStatus(packet.js.s, packet.from.hashname);
      } else if (packet.js.m) {
        return handleMessage(packet.js.m);
      } else {
        return $q.reject(
          'Unrecognized packet format: ' + JSON.stringify(packet.js)
        );
      }

      // //FIXME: get date from packet instead
      // let message = {
      //   id: Date.now().toString(),
      //   content: packet.js
      // };
      //
      // let messageCursor = state.synchronized.tree
      //   .select(['messages']);
      //
      // //TODO: implement toast on new message arrival
      // state.save(messageCursor, [message.id], message)
      //   .then($log.info)
      //   .catch($log.error);
    };
  //TODO: implement channel creation as follows:
  // direct message channel id = sorted(sender, receiver)
  // group message channel id = channelname-creatorhashname
  let listen =
    function listen(channelInfo, handlePacket = handlePayload,
      session = activeSession) {
      try {
        checkSession(session);
        session.listen(channelInfo.id, handlePacket);
      } catch(error) {
        return $q.reject(error);
      }

      return $q.when();
    };

  let handleAcknowledgement =
    function handleAcknowledgement(error, packet, channel, callback) {
      if (error) {
        return $q.reject(error);
      }

      callback(true);
      return $q.when();
    };
  //TODO: refactor to include contact argument
  let send =
    function send(channelInfo, payload, handlePacket = handleAcknowledgement,
      session = activeSession) {
      try {
        checkSession(session);
        session.start(
          channelInfo.contactIds[0],
          channelInfo.id,
          {js: payload},
          handlePacket
        );
      } catch(error) {
        return $q.reject(error);
      }

      return $q.when();
    };

  let sendInvite = function sendInvite(contactId, userInfo) {
    let inviteChannel = {
      id: INVITE_CHANNEL_ID,
      contactIds: [contactId]
    };

    let payload = {
      i: userInfo
    };

    return send(inviteChannel, payload);
  };

  let sendStatus = function sendStatus(contactId, statusId) {
    let userId =
      state.synchronized.tree.select(['identity', 'userInfo']).get().id;
    let contactChannel = createContactChannel(userId, contactId);

    let payload = {
      s: statusId
    };

    return send(contactChannel, payload);
  };

  let initializeChannel = function initializeChannel(channelInfo) {
    listen(channelInfo);
    let sendStatusUpdate = () => {
      if (channelInfo.pendingHandshake) {
        return $log.info('skipping status update. handshake pending');
      }

      sendStatus(channelInfo.contactIds[0], 1)
        .catch($log.error);
    }

    return $interval(sendStatusUpdate, 15000);
  };

  let initialize = function initializeNetwork(keypair) {
    let deferredSession = $q.defer();

    let telehashKeypair = {};
    if (keypair) {
      telehashKeypair.id = keypair;
    }

    telehash.init(telehashKeypair,
      function initializeTelehash(error, telehashSession) {
        if (error) {
          return deferredSession.reject(error);
        }

        return deferredSession.resolve(telehashSession);
      }
    );

    return deferredSession.promise.then((telehashSession) => {
      let sessionInfo = {
        id: telehashSession.hashname,
        keypair: telehashSession.id
      };

      activeSession = telehashSession;
      //DEBUG
      window.tocSession = activeSession;

      listen({id: INVITE_CHANNEL_ID});

      let channels = NETWORK_CURSORS.synchronized.get(['channels']);

      R.pipe(
        R.values,
        R.map(R.prop('channelInfo')),
        R.forEach(initializeChannel)
      )(channels);

      return sessionInfo;
    });
  };

  return {
    NETWORK_CURSORS,
    INVITE_CHANNEL_ID,
    createContactChannel,
    listen,
    send,
    sendInvite,
    sendStatus,
    initializeChannel,
    initialize
  };
}
