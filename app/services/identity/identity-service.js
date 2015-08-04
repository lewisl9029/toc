export let serviceName = 'identity';
export default /*@ngInject*/ function identity(
  $q,
  cryptography,
  R,
  state
) {
  let getAvatarBase = function getAvatarBase(email) {
    // default to hash of unknown-user@toc.im
    if (!email) {
      return getAvatarBase('unknown-user@toc.im');
    }

    let emailHash = cryptography.getMd5(email);

    return `http://cdn.libravatar.org/avatar/${emailHash}?d=identicon`;
  };

  let getAvatar = R.memoize(getAvatarBase);

  let create = function createIdentity(sessionInfo, userInfo) {
    let userCredentials = {
      id: sessionInfo.id,
      password: userInfo.password
    };

    let newUserInfo = {
      id: sessionInfo.id,
      displayName: userInfo.displayName,
      email: userInfo.email
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
    getAvatar,
    create,
    authenticate,
    restore,
    initialize,
    destroy
  };
}
