export default function network($q, state, telehash) {
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

  return {
    NETWORK_CURSORS,
    initialize
  };
}
