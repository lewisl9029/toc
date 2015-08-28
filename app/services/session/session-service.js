export let serviceName = 'session';
export default /*@ngInject*/ function session(
  $q,
  $timeout,
  $window,
  channels,
  contacts,
  devices,
  identity,
  navigation,
  network,
  R,
  state,
  status,
  time
) {
  // let initializeNetwork = function initializeNetwork() {
  //   let sessionInfo = state.cloud.session.get().sessionInfo;
  //   return network.initialize(sessionInfo.keypair)
  //     .then(() => channels.initialize(network.listen))
  //     .then(() => status.initialize());
  // };
  //

  let saveCredentials = function saveCredentials(credentials, staySignedIn) {
    return staySignedIn ?
      state.save(state.local.cryptography, ['savedCredentials'], credentials) :
      $q.when();
  };
  //
  // let updateLatest = function updateLatest() {
  //   return state.save(
  //     state.cloudUnencrypted.session,
  //     ['latest'],
  //     Date.now()
  //   );
  // };

  let create = function createSession(password, staySignedIn) {
    let saveSalt = (credentials) => state.save(
      state.cloudUnencrypted.cryptography,
      ['salt'],
      credentials.salt
    );

    let saveChallege = (salt) => state.save(
      state.cloudUnencrypted.cryptography,
      ['challenge'],
      cryptography.encrypt(salt)
    );

    let saveNetworkInfo = (networkInfo) =>
      state.save(state.cloud.network, ['networkInfo'], networkInfo);

    let saveUserInfo = (networkInfo) => {
      let userInfo = {
        id: networkInfo.id,
        displayName: 'Anonymous'
      };

      return state.save(state.cloud.identity, ['userInfo'], userInfo);
    };

    let saveDerivedCredentials = (derivedCredentials) => {
      return staySignedIn ?
        state.save(
          state.local.cryptography,
          ['derivedCredentials'],
          credentials
        ) :
        $q.when();
    };

    return cryptography.create({password})
      .then(saveSalt)
      .then(saveChallenge)
      .then(() => identity.authenticate(password))
      .then(saveDerivedCredentials)
      .then(() => state.cloud.initialize())
      .then(() => network.initialize())
      .then(saveNetworkInfo)
      .then(saveUserInfo)
      .then(() => devices.initialize(destroy))
      .then(() => channels.initialize(network.listen))
      .then(() => status.initialize())
      .then(() => time.initialize())
      .then(() => navigation.initialize());
      // .then(() => authenticate(password))
      // .then((credentials) => saveCredentials(credentials, options.staySignedIn))
    // let saveUserInfo = function saveUserInfo(userInfo) {
    //   return state.save(
    //       state.cloudUnencrypted.identity,
    //       ['userInfo'],
    //       userInfo
    //     )
    //     .then(() => state.save(
    //       state.cloud.identity,
    //       ['userInfo'],
    //       userInfo
    //     ));
    // };
    //
    // let saveSessionInfo = function saveSessionInfo(sessionInfo) {
    //   return state.save(
    //     state.cloud.session,
    //     ['sessionInfo'],
    //     sessionInfo
    //   );
    // };
    //
    // return network.initialize()
    //   .then((sessionInfo) => {
    //     return identity.initialize()
    //       .then(() => identity.create(sessionInfo, userInfo))
    //       .then((newIdentity) => {
    //         return state.cloud.initialize(newIdentity.userInfo.id)
    //           .then(() => devices.initialize(signOut))
    //           .then(() =>
    //             saveCredentials(newIdentity.credentials, options.staySignedIn)
    //           )
    //           .then(() => saveUserInfo(newIdentity.userInfo));
    //       })
    //       .then(() => saveSessionInfo(sessionInfo));
    //   })
    //   .then(() => channels.initialize(network.listen))
    //   .then(() => status.initialize())
    //   .then(() => updateLatest())
    //   .then(() => navigation.initialize());
  };

  let authenticate = function authenticateSession() {

  };

  let restore = function restoreSession() {
    // return identity.initialize()
    //   .then(() => identity.authenticate(userCredentials))
    //   .then((existingIdentity) => {
    //     return state.cloud.initialize(userCredentials.id)
    //       .then(() => devices.initialize(signOut))
    //       .then(() =>
    //         saveCredentials(existingIdentity.credentials, options.staySignedIn)
    //       );
    //   })
    //   .then(() => contacts.initialize())
    //   .then(() => initializeNetwork())
    //   .then(() => updateLatest())
    //   .then(() => time.initialize())
    //   .then(() => navigation.initialize())
  };

  let initialize = function initialize() {
    let initializeSession = () => {
      let derivedCredentials =
        state.local.cryptography.get(['derivedCredentials']);

      if (!derivedCredentials) {
        return $q.when();
      }

      return restore();
      // return signIn(savedCredentials, options);
    };

    return navigation.setupRedirect()
      .then(() => storage.prepare())
      .then(() => state.initialize())
      .then(() => devices.create())
      .then(() => initializeSession());
    // let localUsers = state.local.cursor.get();
    //
    // let existingIdUserPair;
    //
    // if (R.keys(localUsers).length !== 0) {
    //   existingIdUserPair = R.pipe(
    //     R.toPairs,
    //     R.filter((idUserPair) => idUserPair[1].session),
    //     R.map((idUserPair) => [
    //       idUserPair[0],
    //       idUserPair[1].session
    //     ]),
    //     R.find((idUserPair) => idUserPair[1].savedCredentials)
    //   )(localUsers);
    // }
    //
    // if (!existingIdUserPair) {
    //   let prepareNavigate = !navigation.at(navigation.app.public.welcome) ?
    //     navigation.resetHistory({disableAnimate: true}) :
    //     $q.when();
    //
    //   return prepareNavigate
    //     .then(() => navigation.go(navigation.app.public.welcome))
    //     //workaround for too early initialization
    //     .then(() => $timeout(() => navigation.clearCache(), 0));
    // }
    //
    // let existingIdentity = state.cloudUnencrypted.cursor.get([
    //   existingIdUserPair[0],
    //   'identity'
    // ]);
    //
    // existingIdentity.credentials =
    //   existingIdUserPair[1].savedCredentials;
    //
    // return identity.initialize()
    //   .then(() => identity.restore(existingIdentity))
    //   .then(() => state.cloud.initialize(existingIdentity.userInfo.id))
    //   .then(() => devices.initialize(signOut))
    //   .then(() => contacts.initialize())
    //   .then(() => initializeNetwork())
    //   .then(() => updateLatest())
    //   .then(() => navigation.initialize());
  };

  let destroy = function destroy() {
    return state.remove(
        state.local.session,
        ['derivedCredentials']
      )
      .then(() => $q.when($window.location.reload()));
  };

  return {
    create,
    restore,
    initialize,
    destroy
  };
};
