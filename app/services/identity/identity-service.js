export default function identity(state, R, storage, cryptography) {
  const IDENTITY_PATH = ['identity'];
  const USER_KEY_PREFIX = 'toc-user-';

  //TODO: refactor local users into state.local
  let localUsers = {};

  let create = function createIdentity(userInfo) {
    //TODO: replace with telehash id generation
    //TODO: open issue for why sjcl trims salt by 1 char
    let userId = Date.now().toString().substr(1);

    let userCredentials = {
      id: userId,
      password: userInfo.password
    };

    let sanitizedUserInfo = {
      id: userId,
      displayName: userInfo.displayName,
      email: userInfo.email,
      challenge: cryptography.encrypt(userId, userCredentials)
    };

    // state.initialize(userId);
    // cryptography.initialize(userCredentials);

    localUsers[userId] = sanitizedUserInfo;
    storage.local.storeObject(USER_KEY_PREFIX + userId, sanitizedUserInfo);

    let identity = state.get('identity')
    identity.save(['info'], sanitizedUserInfo)
      .then(() => console.dir(state.tree)); //DEBUG
  };

  let authenticate = function authenticateIdentity(userCredentials) {
    let challenge = localUsers[userCredentials.id].challenge;
    cryptography.initialize(userCredentials);

    let authResult = false;
    try {
      authResult = cryptography.decrypt(challenge) === userCredentials.id;
    }
    catch(error) {
      console.error(error);
    }
    finally {
      console.log(authResult);
      // TODO: initialize state
      state.initialize(userCredentials.id);
      return authResult;
    }
  };

  let initialize = function initializeIdentity() {
    let identityPersistent = state.persistent.tree.select(IDENTITY_PATH);
    let identitySynchronized = state.synchronized.tree.select(IDENTITY_PATH);
  };

  return {
    create,
    authenticate,
    initialize
  };
}
