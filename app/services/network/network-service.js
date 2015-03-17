export default function network($q, $log, state, telehash) {
  const NETWORK_PATH = ['network'];
  const NETWORK_CURSORS = {
    synchronized: state.synchronized.tree.select(NETWORK_PATH)
  };

  let activeSession;

  let checkSession = function checkSession(session) {
    if (session) {
      return;
    }

    throw 'network: no active session';
  };

  let initialize = function initializeNetwork(keypair = {}) {
    let deferredSession = $q.defer();

    telehash.init(keypair,
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

      return sessionInfo;
    });
  };

  let handleMessage = function handleMessage(error, packet, channel, callback) {
    if (error) {
      return $log.error(error);
    }

    //FIXME: get date from packet instead
    let message = {
      id: Date.now().toString(),
      content: packet.js.m
    };

    let messageCursor = state.synchronized.tree
      .select(['messages', message.id]);

    //TODO: implement toast on new message arrival
    state.save(messageCursor, message)
      .catch($log.error);
  };
  //TODO: implement channel creation as follows:
  // direct message channel id = sorted(sender, receiver)
  // group message channel id = channelname-creatorhashname
  let listen = function listen(channelName, handlePacket,
    session = activeSession) {
    checkSession(session);

    session.listen(channelName, handlePacket);
  };


  return {
    NETWORK_CURSORS,
    initialize
  };
}
