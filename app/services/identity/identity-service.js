export default function identity(state, R, storage, cryptography) {
  const USER_KEY_PREFIX = 'toc-user-';
  const USER_INDEX_KEY = 'toc-users';

  //TODO: refactor local users into state.local
  let localUsers = {};

  let create = function createIdentity(userInfo) {
    //TODO: replace with telehash id generation
    //TODO: open issue for why sjcl trims salt by 1 char
    let userId = Date.now().toString().substr(1);

    let sanitizedUserInfo = {
      id: userId,
      displayName: userInfo.displayName,
      email: userInfo.email
    };

    let userCredentials = {
      id: userId,
      password: userInfo.password
    };

    state.initialize(userId);
    cryptography.initialize(userCredentials);

    sanitizedUserInfo.challenge = cryptography.encrypt(userId);

    localUsers[userId] = sanitizedUserInfo;
    storage.local.storeObject(USER_KEY_PREFIX + userId, sanitizedUserInfo);
    storage.local.storeObject(USER_INDEX_KEY, R.keys(localUsers));

    state.save('identity', sanitizedUserInfo)
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
    let userIndex = storage.local.getObject(USER_INDEX_KEY);
    if (userIndex === null) {
      return;
    }

    let existingUsers = R.pipe(
      R.map(userId => [
        userId,
        storage.local.getObject(USER_KEY_PREFIX + userId)
      ]),
      R.fromPairs
    )(userIndex);

    Object.assign(localUsers, existingUsers);
  };

  return {
    localUsers,
    create,
    authenticate,
    initialize
  };
}
