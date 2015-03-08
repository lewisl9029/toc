export default function identity(state, R, storage, cryptography) {
  const USER_KEY_PREFIX = 'toc-user-';
  const USER_INDEX_KEY = 'toc-users';

  //TODO: refactor local users into state.local
  let localUsers = {};

  let create = function createIdentity(userInfo) {
    //TODO: replace with telehash id generation
    let userId = Date.now().toString();

    let sanitizedUserInfo = {
      id: userId,
      displayName: userInfo.displayName,
      email: userInfo.email
    };

    let userCredentials = {
      id: userId,
      password: userInfo.password
    };

    localUsers[userId] = sanitizedUserInfo;
    storage.local.setItem(
      USER_KEY_PREFIX + userId,
      JSON.stringify(sanitizedUserInfo)
    );
    storage.local.setItem(USER_INDEX_KEY, R.keys(localUsers));

    state.initialize(userId);
    cryptography.initialize(userCredentials);

    state.save('identity', sanitizedUserInfo)
      .then(() => console.dir(state.tree));
  };

  let authenticate = function authenticateIdentity(userInfo) {

  };

  let initialize = function initializeIdentity() {
    let userIndex = JSON.parse(storage.getItem(USER_INDEX_KEY));
    if (userIndex === null) {
      return;
    }

    let existingUsers = R.pipe(
      R.map(userId => [
        USER_KEY_PREFIX + userId,
        JSON.parse(storage.local.getItem(USER_KEY_PREFIX + userId))
      ],
      R.fromPairs
    )(userIndex);

    Object.assign(localUsers, existingUsers);
  };

  return {
    create,
    authenticate,
    initialize
  };
}
