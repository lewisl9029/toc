export default function identity($q, state, R, storage, cryptography) {
  const IDENTITY_PATH = ['identity'];
  const IDENTITY_CURSORS = {
    persistent: state.persistent.tree.select(IDENTITY_PATH),
    synchronized: state.synchronized.tree.select(IDENTITY_PATH)
  };

  let create = function createIdentity(userInfo) {
    //TODO: replace with telehash id generation
    //TODO: open issue for why sjcl trims salt by 1 char
    let userCredentials = {
      id: Date.now().toString().substr(1),
      password: userInfo.password
    };

    let persistentUserInfo = {
      id: userCredentials.id,
      displayName: userInfo.displayName,
      email: userInfo.email,
      challenge: cryptography.encrypt(userCredentials.id, userCredentials)
    };

    return state.save(
      IDENTITY_CURSORS.persistent,
      [persistentUserInfo.id, 'userInfo'],
      persistentUserInfo
    ).then(() => {
      cryptography.initialize(userCredentials);
      state.synchronized.initialize(persistentUserInfo.id);

      state.save(
        IDENTITY_CURSORS.synchronized,
        ['userInfo'],
        persistentUserInfo
      );
    });
  };

  let authenticate = function authenticateIdentity(userCredentials) {
    let challenge = IDENTITY_CURSORS.persistent
      .get([userCredentials.id, 'userInfo']).challenge;

    try {
      cryptography.decrypt(challenge, userCredentials);
    }
    catch(error) {
      return $q.reject('Authentication failed');
    }

    cryptography.initialize(userCredentials);
    return state.synchronized.initialize(userCredentials.id);
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
