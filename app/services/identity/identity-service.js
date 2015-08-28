export let serviceName = 'identity';
export default /*@ngInject*/ function identity(
  $q,
  $filter,
  cryptography,
  R,
  state
) {
  let getAvatarBase = R.memoize(function getAvatarBase(identifier) {
    let identifierHash = cryptography.getMd5(identifier);

    return `http://cdn.libravatar.org/avatar/${identifierHash}?d=identicon`;
  });

  let getAvatar = function getAvatar(userInfo) {
    if (userInfo.email) {
      return getAvatarBase(userInfo.email);
    }

    if (userInfo.id) {
      return getAvatarBase(userInfo.id);
    }

    // default to hash of unknown-user@toc.im
    return getAvatarBase('unknown-user@toc.im');
  };

  let validateId = function validateId(id) {
    //TODO: add a regex matcher to ensure it's in hex
    return id.length === 64;
  };

  let create = function createIdentity(sessionInfo, userInfo) {
    // let userCredentials = {
    //   id: sessionInfo.id,
    //   password: userInfo.password
    // };
    //
    // let newUserInfo = {
    //   id: sessionInfo.id,
    //   displayName: userInfo.displayName,
    //   email: userInfo.email
    // };
    //
    // let credentials = cryptography.initialize(userCredentials);
    //
    // try {
    //   newUserInfo.challenge = cryptography.encrypt(userCredentials.id);
    //   cryptography.decrypt(newUserInfo.challenge);
    // } catch(error) {
    //   cryptography.destroy();
    //   return $q.reject(error);
    // }
    //
    // let newIdentity = {
    //   userInfo: newUserInfo,
    //   credentials
    // };
    //
    // return $q.when(newIdentity);
  };

  let verifyCredentials = function verifyCredentials(derivedCredentials) {
    let challenge = state.cloudUnencrypted.cryptography.get(['challenge']);

    if (!challenge) {
      return $q.reject('identity: missing auth challenge');
    }

    try {
      cryptography.decrypt(challenge);
    }
    catch(error) {
      return cryptography.destroy()
        .then(() => $q.reject('identity: wrong password'));
    }

    return $q.when(derivedCredentials);
  };

  let authenticate = function authenticateIdentity(password) {
    let salt = state.cloudUnencrypted.cryptography.get(['salt']);

    if (!password || !salt) {
      return $q.reject('identity: missing auth parameters');
    }

    return cryptography.initialize({password, salt})
      .then(verifyCredentials);
  };

  let restore = function restoreIdentity(derivedCredentials) {
    return cryptography.restore(derivedCredentials)
      .then(verifyCredentials);
  };

  let initialize = function initializeIdentity() {
    return $q.when();
    // return state.save(
    //   state.memory.cursors.identity,
    //   ['currentUser'],
    //   userId
    // );
  };

  let destroy = function destroyIdentity() {
    return $q.when();
    // return state.remove(
    //   state.memory.cursors.identity,
    //   ['currentUser']
    // );
  };

  return {
    getAvatar,
    create,
    validateId,
    authenticate,
    restore,
    initialize,
    destroy
  };
}
