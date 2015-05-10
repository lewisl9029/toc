export default function identity($q, state, R, network, cryptography) {
  const IDENTITY_PATH = ['identity'];
  const IDENTITY_CURSORS = {
    persistent: state.persistent.tree.select(IDENTITY_PATH),
    synchronized: state.synchronized.tree.select(IDENTITY_PATH)
  };

  let create = function createIdentity(userInfo) {
    //TODO: replace with telehash id generation
    //TODO: open issue for why sjcl trims salt by 1 char
    // id: Date.now().toString().substr(1),
    let userCredentials = {
      id: undefined,
      password: userInfo.password
    };

    let persistentUserInfo = {
      id: undefined,
      displayName: userInfo.displayName,
      email: userInfo.email,
      challenge: undefined
    };

    let newUserInfo = {
      id: undefined,
      displayName: userInfo.displayName,
      email: userInfo.email
    };

    let sessionInfo;

    return network.initialize()
      .then((newSessionInfo) => {
        sessionInfo = newSessionInfo;
        userCredentials.id = sessionInfo.id;
        persistentUserInfo.id = sessionInfo.id;
        newUserInfo.id = sessionInfo.id;
        try {
          cryptography.initialize(userCredentials);
          persistentUserInfo.challenge =
            cryptography.encrypt(userCredentials.id);
          if (cryptography.decrypt(persistentUserInfo.challenge) !==
            userCredentials.id) {
              throw 'identity: failed to validate challenge';
            };
        } catch(error) {
          cryptography.destroy();
          return $q.reject(error);
        }
      })
      .then(() => state.save(
        IDENTITY_CURSORS.persistent,
        [persistentUserInfo.id, 'userInfo'],
        persistentUserInfo
      ))
      .then(() => {
        //TODO: need to initialize with primary userId to connect to module
        // possibly add another remotestorage module that stores users's ids
        return state.synchronized.initialize(persistentUserInfo.id);
      })
      .then(() => state.save(
        IDENTITY_CURSORS.synchronized,
        ['userInfo'],
        newUserInfo
      ))
      .then(() => state.save(
        network.NETWORK_CURSORS.synchronized,
        ['sessions', sessionInfo.id, 'sessionInfo'],
        sessionInfo
      ));
  };

  let authenticate = function authenticateIdentity(userCredentials) {
    let challenge = IDENTITY_CURSORS.persistent
      .get([userCredentials.id, 'userInfo']).challenge;

    try {
      cryptography.decrypt(challenge, userCredentials);
    }
    catch(error) {
      return $q.reject('Wrong password.');
    }

    cryptography.initialize(userCredentials);
    return state.synchronized.initialize(userCredentials.id)
      .then(() => {
        let contactsCursor = state.synchronized.tree.select(['contacts']);

        R.pipe(
          R.keys,
          R.forEach((contactId) =>
            contactsCursor.set([contactId, 'statusId'], 0)
          )
        )(contactsCursor.get());
      })
      .then(() => network.NETWORK_CURSORS.synchronized.get(
        ['sessions', userCredentials.id, 'sessionInfo']
      ))
      .then((sessionInfo) =>
        network.initialize(sessionInfo.keypair)
      );
  };

  let initialize = function initializeIdentity() {
  };

  return {
    IDENTITY_CURSORS,
    create,
    authenticate,
    initialize
  };
}
