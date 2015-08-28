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

  let authenticate = function authenticateIdentity(password) {
    let challenge = state.cloudUnencrypted.cryptography.get(['challenge']);
    let salt = state.cloudUnencrypted.cryptography.get(['salt']);

    if (!password || !challenge || !salt) {
      return $q.reject('identity: missing auth info');
    }

    return cryptography.initialize({password, salt})
      .then((derivedCredentials) => {
        try {
          cryptography.decrypt(challenge);
        }
        catch(error) {
          cryptography.destroy();
          return $q.reject('identity: wrong password');
        }

        return $q.when(derivedCredentials);
      });
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
