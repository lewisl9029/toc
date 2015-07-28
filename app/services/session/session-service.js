export default function session(state, identity, devices, contacts, $state,
  notification, navigation, network, $q, $window, $timeout, R) {
  let initializeNetwork = function initializeNetwork() {
    let sessionInfo = state.cloud.session.get().sessionInfo;
    return network.initialize(sessionInfo.keypair)
      .then(() => network.initializeChannels());
  };

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
              .then(() =>
                saveCredentials(newIdentity.credentials, options.staySignedIn)
              )
              .then(() => saveUserInfo(newIdentity.userInfo));
          })
          .then(() => saveSessionInfo(sessionInfo));
      })
      .then(() => updateLatest())
      .then(() => navigation.initialize())
      .catch((error) =>
        notification.error(error, 'Sign Up Error')
          .then(() => identity.destroy())
      );
  };

  let signIn = function signIn(userCredentials, options) {
    return identity.initialize(userCredentials.id)
      .then(() => identity.authenticate(userCredentials))
      .then((existingIdentity) => {
        return state.cloud.initialize(userCredentials.id)
          .then(() => devices.initialize(signOut))
          .then(() =>
            saveCredentials(existingIdentity.credentials, options.staySignedIn)
          );
      })
      .then(() => contacts.initialize())
      .then(() => initializeNetwork())
      .then(() => updateLatest())
      .then(() => navigation.initialize())
      .catch((error) =>
        notification.error(error, 'Sign In Error')
          .then(() => identity.destroy())
      );
  };

  let restore = function restore() {
    let localUsers = state.local.cursor.get();

    let existingIdUserPair;

    if (R.keys(localUsers).length !== 0) {
      existingIdUserPair = R.pipe(
        R.toPairs,
        R.filter((idUserPair) => idUserPair[1].session),
        R.map((idUserPair) => [
          idUserPair[0],
          idUserPair[1].session
        ]),
        R.find((idUserPair) => idUserPair[1].savedCredentials)
      )(localUsers);
    }

    if (!existingIdUserPair) {
      let prepareNavigate = !$state.is('app.welcome') ?
        navigation.resetHistory({disableAnimate: true}) :
        $q.when();

      return prepareNavigate
        .then(() => $state.go('app.welcome'))
        //workaround for too early initialization
        .then(() => $timeout(() => navigation.clearCache(), 0));
    }

    let existingIdentity = state.cloudUnencrypted.cursor.get([
      existingIdUserPair[0],
      'identity'
    ]);

    existingIdentity.credentials =
      existingIdUserPair[1].savedCredentials;

    return identity.initialize(existingIdentity.userInfo.id)
      .then(() => identity.restore(existingIdentity))
      .then(() => state.cloud.initialize(existingIdentity.userInfo.id))
      .then(() => devices.initialize(signOut))
      .then(() => contacts.initialize())
      .then(() => initializeNetwork())
      .then(() => updateLatest())
      .then(() => navigation.initialize())
      .catch((error) =>
        notification.error(error, 'Restore Error')
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
    restore,
    signOut
  };
};
