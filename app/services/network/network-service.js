export default function network($q, state, telehash) {
  const NETWORK_PATH = ['network'];
  const NETWORK_CURSORS = {
    synchronized: state.synchronized.tree.select(NETWORK_PATH)
  };

  let initialize = function initializeNetwork(keypair = {}) {
    let deferredSession = $q.defer();

    telehash.init(keypair,
      function initializeTelehash(error, telehashSessionInfo) {
        if (error) {
          return deferredSession.reject(error);
        }

        return deferredSession.resolve(telehashSessionInfo);
      }
    );

    return deferredSession.promise.then((telehashSessionInfo) => {
      let sessionInfo = {
        id: telehashSessionInfo.hashname,
        keypair: telehashSessionInfo.id
      };

      return sessionInfo;
    });
  };

  return {
    NETWORK_CURSORS,
    initialize
  };
}
