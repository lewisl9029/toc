export default function identity($q, state, R, cryptography) {
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

    try {
      cryptography.initialize(userCredentials);
      newUserInfo.challenge =
        cryptography.encrypt(userCredentials.id);
      if (cryptography.decrypt(newUserInfo.challenge) !==
        userCredentials.id) {
          throw new Error('identity: failed to validate challenge');
        };
    } catch(error) {
      cryptography.destroy();
      return $q.reject(error);
    }

    return $q.when(newUserInfo);
  };

  let authenticate = function authenticateIdentity(userCredentials) {
    let challenge = state.persistent.cursors.identity
      .get([userCredentials.id, 'userInfo']).challenge;

    try {
      cryptography.initialize(userCredentials);
      cryptography.decrypt(challenge);
    }
    catch(error) {
      cryptography.destroy();
      return $q.reject('identity: wrong password');
    }

    return $q.when(userCredentials);
  };

  let initialize = function initializeIdentity() {
  };

  return {
    create,
    authenticate,
    initialize
  };
}
