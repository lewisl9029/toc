export let serviceName = 'identity';
export default /*@ngInject*/ function identity(
  $q,
  $filter,
  cryptography,
  R,
  state
) {
  let getUserExists = () =>
    state.cloudUnencrypted.cryptography.get() !== undefined;

  let getAvatarBase = R.memoize(function getAvatarBase(identifier) {
    let identifierHash = cryptography.getMd5(identifier);
    // cordova app crashes if we don't add the .jpg
    return `http://cdn.libravatar.org/avatar/${identifierHash}.jpg?s=96&d=identicon`;
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
    let idRegex = /^[a-f0-9]{64}$/i;
    return idRegex.test(id);
  };

  let authenticate = function authenticate(derivedCredentials) {
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

  let initialize = function initializeIdentity(credentials, staySignedIn) {
    let saveCredentials = (derivedCredentials) => {
      if (!staySignedIn) {
        return $q.when();
      }

      let existingCredentials =
        state.local.cryptography.get(['derivedCredentials']);

      if (existingCredentials) {
        return $q.when();
      }

      return state.save(
        state.local.cryptography,
        ['derivedCredentials'],
        derivedCredentials
      );
    }

    let verifyCredentials = (credentials) =>
      cryptography.initialize(credentials)
        .then(authenticate)
        .then(saveCredentials);

    if (credentials.key) {
      return verifyCredentials(credentials);
    }

    if (!credentials.password) {
      return $q.reject('identity: no password or key provided');
    }

    let existingSalt = state.cloudUnencrypted.cryptography.get(['salt']);

    if (existingSalt) {
      let rawCredentials = {
        password: credentials.password,
        salt: existingSalt
      };

      return verifyCredentials(rawCredentials);
    }

    let saveSalt = (salt) => state.save(
      state.cloudUnencrypted.cryptography,
      ['salt'],
      salt
    );

    let saveChallege = (challenge) => state.save(
      state.cloudUnencrypted.cryptography,
      ['challenge'],
      challenge
    );

    return cryptography.createSalt()
      .then(saveSalt)
      .then((salt) => cryptography.initialize({
          password: credentials.password,
          salt: salt
        })
        .then(saveCredentials)
        .then(() => cryptography.createChallenge(salt)))
      .then(saveChallege);
  };

  let destroy = function destroyIdentity() {
    return $q.when();
  };

  return {
    getUserExists,
    getAvatar,
    validateId,
    authenticate,
    initialize,
    destroy
  };
}
