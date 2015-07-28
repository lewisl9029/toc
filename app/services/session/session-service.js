export default function session(state, identity, devices, contacts,
  notification, navigation, network, $q, $window) {
  let saveCredentials = function saveCredentials(credentials, staySignedIn) {
    return staySignedIn ?
      state.save(
        state.local.session,
        ['savedCredentials'],
        credentials
      ) :
      $q.when();
  };

  let updateLatest = function updateLatest() {
    return state.save(
      state.cloudUnencrypted.session,
      ['latest'],
      Date.now()
    );
  };

  let signUp = function signUp(userInfo, options) {
    let saveUserInfo = function saveUserInfo(userInfo) {
      return state.save(
          state.cloudUnencrypted.identity,
          ['userInfo'],
          userInfo
        )
        .then(() => state.save(
          state.cloud.identity,
          ['userInfo'],
          userInfo
        ));
    };

    let saveSessionInfo = function saveSessionInfo(sessionInfo) {
      return state.save(
        state.cloud.session,
        ['sessionInfo'],
        sessionInfo
      );
    };

    return network.initialize()
      .then((sessionInfo) => {
        return identity.initialize(sessionInfo.id)
          .then(() => network.initializeChannels())
          .then(() => identity.create(sessionInfo, userInfo))
          .then((newIdentity) => {
            return state.cloud.initialize(newIdentity.userInfo.id)
              .then(() => devices.initialize(signOut))
              .then(() => saveUserInfo(newIdentity.userInfo))
              .then(() => saveSessionInfo(sessionInfo))
              .then(() =>
                saveCredentials(newIdentity.credentials, options.staySignedIn)
              );
          })
      })
      .then(() => updateLatest())
      .then(() => navigation.initialize())
      .catch((error) =>
        notification.error(error, 'Sign Up Error')
          .then(() => identity.destroy())
      );
  };

  let signIn = function signIn(userCredentials, options) {
    let initializeNetwork = function initializeNetwork() {
      let sessionInfo = state.cloud.session.get().sessionInfo;
      return network.initialize(sessionInfo.keypair)
        .then(() => network.initializeChannels());
    };

    return identity.initialize(userCredentials.id)
      .then(() => identity.authenticate(userCredentials))
      .then((existingIdentity) =>
        saveCredentials(existingIdentity.credentials, options.staySignedIn)
      )
      .then(() => state.cloud.initialize(userCredentials.id))
      .then(() => devices.initialize(signOut))
      .then(() => contacts.initialize())
      .then(() => initializeNetwork())
      .then(() => updateLatest())
      .then(() => navigation.initialize())
      .catch((error) =>
        notification.error(error, 'Sign In Error')
          .then(() => identity.destroy())
      );
  };

  let signOut = function signOut() {
    return state.remove(
        state.local.session,
        ['savedCredentials']
      )
      .then(() => $q.when($window.location.reload()))
      .catch((error) => notification.error(error, 'SignOut Error'));
  };

  return {
    signUp,
    signIn,
    signOut
  };
};
