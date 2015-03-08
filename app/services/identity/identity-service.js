export default function identity(state, storage, cryptography) {
  const USERS_KEY = 'toc-local-users';

  let createNewIdentity = function createNewIdentity(userInfo) {
    //TODO: replace with telehash id generation
    let userId = Date.now();

    let sanitizedUserInfo = {
      id: userId,
      displayName: userInfo.displayName,
      email: userInfo.email
    };

    let userCredentials = {
      id: userId,
      password: userInfo.password
    };

    let localUsers = JSON.parse(storage.local.getItem(USERS_KEY));

    if (localUsers === null) {
      localUsers = {};
    }

    localUsers[userId] = sanitizedUserInfo;

    storage.local.setItem(USERS_KEY, JSON.stringify(localUsers));

    state.initialize(userId);
    cryptography.initialize(userCredentials);

    state.save('identity', sanitizedUserInfo)
      .then(() => console.dir(state.cache));
  };

  let initialize = function initializeIdentity() {
  };

  return {
    createNewIdentity: createNewIdentity,
    initialize: initialize
  };
}
