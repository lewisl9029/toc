export default function identity($q, state, R, network, cryptography) {
  let create = function createIdentity(userInfo) {
    let userCredentials = {
      id: undefined,
      password: userInfo.password
    };

    let persistentUserInfo = {
      id: undefined,
      displayName: userInfo.displayName,
      email: userInfo.email,
      challenge: undefined
    };

    let newUserInfo = {
      id: undefined,
      displayName: userInfo.displayName,
      email: userInfo.email
    };

    let sessionInfo;

    return network.initialize()
      .then((newSessionInfo) => {
        sessionInfo = newSessionInfo;
        userCredentials.id = sessionInfo.id;
        persistentUserInfo.id = sessionInfo.id;
        newUserInfo.id = sessionInfo.id;
        try {
          cryptography.initialize(userCredentials);
          persistentUserInfo.challenge =
            cryptography.encrypt(userCredentials.id);
          if (cryptography.decrypt(persistentUserInfo.challenge) !==
            userCredentials.id) {
              throw new Error('identity: failed to validate challenge');
            };
        } catch(error) {
          cryptography.destroy();
          return $q.reject(error);
        }
      })
      .then(() => state.save(
        state.persistent.cursors.identity,
        [persistentUserInfo.id, 'userInfo'],
        persistentUserInfo
      ))
      .then(() => state.save(
        state.persistent.cursors.identity,
        [persistentUserInfo.id, 'latestSession'],
        Date.now()
      ))
      //TODO: need to initialize with primary userId to connect to module
      // possibly add another remotestorage module that stores users's ids
      .then(() => state.synchronized.initialize(persistentUserInfo.id))
      .then(() => state.save(
        state.synchronized.cursors.identity,
        ['userInfo'],
        newUserInfo
      ))
      .then(() => state.save(
        state.synchronized.cursors.network,
        ['sessions', sessionInfo.id, 'sessionInfo'],
        sessionInfo
      ));
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

    return state.save(
        state.persistent.cursors.identity,
        [userCredentials.id, 'latestSession'],
        Date.now()
      )
      .then(() => state.synchronized.initialize(userCredentials.id))
      .then(() => {
        let contactsCursor = state.synchronized.cursors.contacts;

        R.pipe(
          R.keys,
          R.forEach((contactId) =>
            contactsCursor.set([contactId, 'statusId'], 0)
          )
        )(contactsCursor.get());
      })
      .then(() => state.synchronized.cursors.network.get(
        ['sessions', userCredentials.id, 'sessionInfo']
      ))
      .then((sessionInfo) =>
        network.initialize(sessionInfo.keypair)
      );
  };

  let initialize = function initializeIdentity() {
  };

  return {
    create,
    authenticate,
    initialize
  };
}
