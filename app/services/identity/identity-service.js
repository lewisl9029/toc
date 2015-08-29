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
    let saveCredentials = (derivedCredentials) => staySignedIn ?
        state.save(
          state.local.cryptography,
          ['derivedCredentials'],
          derivedCredentials
        ) :
        $q.when();

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
    getAvatar,
    validateId,
    authenticate,
    initialize,
    destroy
  };
}
