export default function identity(state, R, storage, cryptography) {
  const USER_KEY_PREFIX = 'toc-users-';

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

    storage.local.setItem(
      USER_KEY_PREFIX + userId,
      JSON.stringify(sanitizedUserInfo)
    );
    localUsers[userId] = sanitizedUserInfo;

    state.initialize(userId);
    cryptography.initialize(userCredentials);

    state.save('identity', sanitizedUserInfo)
      .then(() => console.dir(state.tree));
  };

  let authenticate = function authenticateIdentity(userInfo) {

  };

  let initialize = function initializeIdentity() {
    let existingUsers = R.pipe(
      R.map(index => storage.local.key(index)),
      R.filter(key => key.startsWith(USER_KEY_PREFIX)),
      R.map(userKey => [
        userKey.slice(USER_KEY_PREFIX.length),
        JSON.parse(storage.local.getItem(userKey))
      ],
      R.fromPairs
    )(R.range(0, storage.local.length));

    Object.assign(localUsers, existingUsers);
  };

  return {
    create,
    authenticate,
    initialize
  };
}
