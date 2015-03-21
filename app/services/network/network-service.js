export default function network($q, $interval, R, state, telehash,
  notification) {
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

    let contactCursor = state.synchronized.tree
      .select(['contacts', contactId]);

    let currentContactStatus = contactCursor.get(['statusId']);

    if (currentContactStatus === statusId) {
      return $q.when();
    }

    return state.save(
      state.synchronized.tree.select(['contacts']),
      [contactId, 'statusId'],
      statusId
    );
  };

  let handleMessage = function handleMessage(messagePayload, sentTime,
    contactId, channelId) {
    let messageId = sentTime + '-' + contactId;

    let message = {
      id: messageId,
      //TODO: find main contact userId from sender userId
      sender: contactId,
      time: sentTime,
      content: messagePayload
    };

    return state.save(
      NETWORK_CURSORS.synchronized.select(['channels', channelId, 'messages']),
      [messageId],
      message
    );
  };

  let listen = function listen(channelInfo, session = activeSession) {
    let handlePacket = (error, packet, channel, callback) => {
      let handledPacket = () => {
        if (error) {
          return $q.reject(error);
        }

        callback(true);
        channel.send({js: {a: packet.from.sentAt}});

        if (packet.js.i) {
          return handleInvite(packet.js.i);
        } else if (packet.js.s) {
          return handleStatus(packet.js.s, packet.from.hashname);
        } else if (packet.js.m) {
          //TODO: implement toast on new message arrival
          return handleMessage(
            packet.js.m,
            packet.from.sentAt,
            packet.from.hashname,
            channel.type.substr(1) //remove leading underscore
          );
        } else {
          return $q.reject(
            'Unrecognized packet format: ' + JSON.stringify(packet.js)
          );
        }
      };

      return handledPacket();
    };

    let listenResult;
    try {
      checkSession(session);
      listenResult = session.listen(channelInfo.id, handlePacket);
    } catch(error) {
      return $q.reject(error);
    }

    return $q.when(listenResult);
  };

  let send =
    function send(channelInfo, payload, session = activeSession) {
      let sentMessage = $q.defer();

      let handleAcknowledgement = (error, packet, channel, callback) => {
        if (error) {
          return sentMessage.reject(error);
        }

        callback(true);
        return sentMessage.resolve(packet.js.a);
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
        return sentMessage.reject(error);
      }

      return sentMessage.promise;
    };

  let handleSendTimeout =
    function handleSendTimeout(error, contactId, contactStatusId) {
      if (error !== 'timeout') {
        return $q.reject(error);
      }

      let contactCursor = state.synchronized.tree
        .select(['contacts', contactId]);

      // do not change status back to offline if contact was already offline
      // or if contact status has been updated since message was sent
      let currentContactStatusId = contactCursor.get(['statusId']);
      if (currentContactStatusId === 0 ||
        currentContactStatusId !== contactStatusId) {
        return $q.reject(error);
      }

      return state.save(
        state.synchronized.tree.select(['contacts']),
        [contactId, 'statusId'],
        0
      );
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

    let contactCursor = state.synchronized.tree
      .select(['contacts', contactId]);

    let previousContactStatusId = contactCursor.get(['statusId']);

    if (previousContactStatusId === undefined) {
      return $q.when();
    }

    return send(contactChannel, payload)
      .catch((error) =>
        handleSendTimeout(error, contactId, previousContactStatusId)
      );
  };

  let sendMessage = function sendMessage(channelInfo, messageContent) {
    let payload = {
      m: messageContent
    };

    let handleMessageAck = (acknowledgement) => {
      let sentTime = acknowledgement;

      let userId =
        state.synchronized.tree.select(['identity', 'userInfo']).get().id;
      let messageId = sentTime + '-' + userId;

      let message = {
        id: messageId,
        //TODO: find main contact userId from sender userId
        sender: userId,
        time: sentTime,
        content: messageContent
      };

      return state.save(
        NETWORK_CURSORS.synchronized.select(
          ['channels', channelInfo.id, 'messages']
        ),
        [messageId],
        message
      );
    };

    let contactId = channelInfo.contactIds[0];

    let previousContactStatusId = state.synchronized.tree
      .select(['contacts', contactId]).get(['statusId']);

    if (previousContactStatusId === undefined) {
      return $q.when();
    }

    return send(channelInfo, payload)
      .then(handleMessageAck)
      .catch((error) =>
        handleSendTimeout(error, contactId, previousContactStatusId)
      );
  };

  let initializeChannel = function initializeChannel(channelInfo) {
    let listenResult = listen(channelInfo)
      .catch((error) => notification.error(error, 'Network Listen Error'));

    if (channelInfo.contactIds.length !== 1) {
      return listenResult;
    }

    let sendStatusUpdate = () => sendStatus(channelInfo.contactIds[0], 1)
      .catch((error) => {
        if (error === 'timeout') {
          return $q.when();
        }

        return notification.error(error, 'Status Update Error');
      });

    sendStatusUpdate();
    return $interval(sendStatusUpdate, 15000);
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
    sendMessage,
    initializeChannel,
    initialize
  };
}
