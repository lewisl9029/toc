export default function session(state, identity, devices, contacts, notification, navigation, network, $q, $window) {
  //TODO: to be refactored from signin-form/signup-form/app-run
  let signIn = function signIn(userCredentials, options) {
    let saveCredentials =
      function saveCredentials(savedCredentials, staySignedIn) {
        return staySignedIn ?
          state.save(
            state.local.session,
            ['savedCredentials'],
            savedCredentials
          ) :
          $q.when();
      };

    let initializeNetwork = function initializeNetwork() {
      let sessionInfo = state.cloud.session.get().sessionInfo;
      return network.initialize(sessionInfo.keypair)
        .then(() => network.initializeChannels());
    };

    let updateLatest = function updateLatest() {
      return state.save(
        state.cloudUnencrypted.session,
        ['latest'],
        Date.now()
      ));
    };

    return identity.initialize(userCredentials.id)
      .then(() => identity.authenticate(userCredentials))
      .then((savedCredentials) =>
        saveCredentials(savedCredentials, options.staySignedIn))
      .then(() => state.cloud.initialize(userCredentials.id))
      .then(() => devices.initialize(signOut))
      .then(() => contacts.initialize())
      .then(() => initializeNetwork())
      .then(() => updateLatest())
      .then(() => navigation.initialize('app.home'))
      .catch((error) =>
        notification.error(error, 'SignIn Error')
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
    signIn,
    signOut
  };
};
