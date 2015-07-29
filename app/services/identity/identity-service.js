export default function identity($q, state, R, cryptography) {
  let create = function createIdentity(sessionInfo, userInfo) {
    let userCredentials = {
      id: sessionInfo.id,
      password: userInfo.password
    };

    let emailHash = cryptography.getMd5(userInfo.email);

    let newUserInfo = {
      id: sessionInfo.id,
      displayName: userInfo.displayName,
      email: userInfo.email,
      avatar: `http://cdn.libravatar.org/avatar/${emailHash}?d=identicon`
    };

    let credentials = cryptography.initialize(userCredentials);

    try {
      newUserInfo.challenge = cryptography.encrypt(userCredentials.id);
      cryptography.decrypt(newUserInfo.challenge);
    } catch(error) {
      cryptography.destroy();
      return $q.reject(error);
    }

    let newIdentity = {
      userInfo: newUserInfo,
      credentials
    };

    return $q.when(newIdentity);
  };

  let authenticate = function authenticateIdentity(userCredentials) {
    let userInfo = state.cloudUnencrypted.identity.get().userInfo;
    let challenge = userInfo.challenge;

    let credentials = cryptography.initialize(userCredentials);

    try {
      cryptography.decrypt(challenge);
    }
    catch(error) {
      cryptography.destroy();
      return $q.reject('identity: wrong password');
    }

    let existingIdentity = {
      userInfo,
      credentials
    };

    return $q.when(existingIdentity);
  };

  let restore = function restoreIdentity(existingIdentity) {
    try {
      cryptography.restore(existingIdentity.credentials);
      cryptography.decrypt(existingIdentity.userInfo.challenge);
    }
    catch(error) {
      cryptography.destroy();
      return $q.reject('identity: wrong saved credentials');
    }

    return $q.when(existingIdentity);
  };

  let initialize = function initializeIdentity(userId) {
    state.initializeUserCursors(userId);
    return $q.when();
    // return state.save(
    //   state.memory.cursors.identity,
    //   ['currentUser'],
    //   userId
    // );
  };

  let destroy = function destroyIdentity() {
    state.destroyUserCursors();
    return $q.when();
    // return state.remove(
    //   state.memory.cursors.identity,
    //   ['currentUser']
    // );
  };

  return {
    create,
    authenticate,
    restore,
    initialize,
    destroy
  };
}
