export default function network($q, $log, state, telehash) {
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

  let handleMessage =
    function handleMessage(error, packet, channel, callback) {
      if (error) {
        return $log.error(error);
      }

      callback(true);
      channel.send();

      if (packet.js.i) {
        let contactInfo = packet.js.i;

        let userId =
          state.synchronized.tree.select(['identity', 'userInfo']).get().id;

        let channel = createContactChannel(userId, contactInfo.id);
        channel.accepted = false;

        return state.save(
          NETWORK_CURSORS.synchronized,
          ['channels', channel.id, 'channelInfo'],
          channel
        ).then(() => state.save(
          state.synchronized.tree.select(['contacts']),
          [contactInfo.id, 'userInfo'],
          contactInfo
        ));
      };

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
    function listen(channel, handlePacket = handleMessage,
      session = activeSession) {
      try {
        checkSession(session);
        session.listen(channel.id, handlePacket);
      } catch(error) {
        return $q.reject(error);
      }

      return $q.when();
    };

  let handleAcknowledgement =
    function handleAcknowledgement(error, packet, channel, callback) {
      if (error) {
        return $log.error(error);
      }

      callback(true);
    };
  //TODO: refactor to include contact argument
  let send =
    function send(channel, payload, handlePacket = handleAcknowledgement,
      session = activeSession) {
      try {
        checkSession(session);
        session.start(
          channel.contactIds[0],
          channel.id,
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
    initialize
  };
}
