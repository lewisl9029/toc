export let serviceName = 'session';
export default /*@ngInject*/ function session(
  $q,
  $log,
  $timeout,
  $window,
  buffer,
  channels,
  contacts,
  devices,
  identity,
  navigation,
  network,
  notifications,
  messages,
  R,
  state,
  status,
  storage,
  time
) {
  let preparingPrivateSession = $q.defer();
  let preparingPublicSession = $q.defer();

  let preparePrivate = function prepareSession() {
    return preparingPrivateSession.promise;
  };

  let preparePublic = function prepareSession() {
    return preparingPublicSession.promise;
  };

  let start = function start(credentials, staySignedIn) {
    // passing services into initialize as workaround for circular dependencies
    return identity.initialize(credentials, staySignedIn)
      .then(() => state.cloud.initialize())
      .then(() => network.initialize())
      .then(() => devices.initialize(sessionService))
      .then(() => channels.initialize(network))
      .then(() => status.initialize())
      .then(() => contacts.initialize(status, network))
      .then(() => messages.initialize())
      .then(() => notifications.initialize(contacts))
      .then(() => buffer.initialize(network, status))
      .then(() => time.initialize())
      .then(() => navigation.initialize())
      .then(() => identity.setUserExists())
      .then(() => {
        preparingPrivateSession.resolve('session: private ready')
        $window.tocHideLoadingScreen();

        return $q.when();
      });
  };

  let initialize = function initializeSession() {
    let startSession = () => {
      let derivedCredentials =
        state.local.cryptography.get(['derivedCredentials']);
      let userExists = state.cloudUnencrypted.identity.get(['userExists']);

      if (!derivedCredentials || !userExists) {
        return navigation.initializePublic()
          .then(() => {
            preparingPublicSession.resolve('session: public ready');
            return $q.when();
          });
      }

      return start(derivedCredentials);
    };

    return navigation.setupRedirect()
      .then(() => storage.prepare())
      .then(() => state.initialize())
      .then(() => devices.create())
      .then(() => startSession())
      .catch($log.error);
  };

  let destroy = function destroySession() {
    return state.remove(
        state.local.cryptography,
        ['derivedCredentials']
      )
      .then(() => $timeout(() => $window.location.reload(), 0, false));
  };

  let sessionService = {
    preparePublic,
    preparePrivate,
    start,
    initialize,
    destroy
  };

  return sessionService;
};
