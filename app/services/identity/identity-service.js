export default function identity(state, R, storage, cryptography) {
  const IDENTITY_PATH = ['identity'];

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

    let identityCursorPersistent = state.persistent.tree
      .select(identity.IDENTITY_PATH);

    return state.save(
      identityCursorPersistent,
      [persistentUserInfo.id, 'userInfo'],
      persistentUserInfo
    ).then(() => {
      cryptography.initialize(userCredentials);
      state.synchronized.initialize(persistentUserInfo.id);
      let identityCursorSynchronized = state.synchronized.tree
        .select(identity.IDENTITY_PATH);

      state.save(
        identityCursorSynchronized,
        ['userInfo'],
        persistentUserInfo
      )
    });

    // state.initialize(userId);
    // cryptography.initialize(userCredentials);

    // localUsers[userId] = sanitizedUserInfo;
    // storage.local.storeObject(USER_KEY_PREFIX + userId, sanitizedUserInfo);
    //
    // let identity = state.get('identity')
    // identity.save(['info'], sanitizedUserInfo)
    //   .then(() => console.dir(state.tree)); //DEBUG
  };

  let authenticate = function authenticateIdentity(userCredentials) {
    let challenge = state.persistent.tree
      .get(R.append(userCredentials.id)(IDENTITY_PATH)).challenge;

    let authResult = false;
    try {
      authResult =
        cryptography.decrypt(challenge, userCredentials) ===
          userCredentials.id;
    }
    catch(error) {
      console.log(error);
    }
    finally {
      return authResult;
    }
  };

  let initialize = function initializeIdentity() {
  };

  return {
    IDENTITY_PATH,
    create,
    authenticate,
    initialize
  };
}
