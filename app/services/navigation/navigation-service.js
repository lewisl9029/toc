export let serviceName = 'navigation';
export default /*@ngInject*/ function navigation(
  $ionicHistory,
  $q,
  $rootScope,
  $state,
  $timeout,
  R,
  state
) {
  const app = {
    public: {
      welcome: 'app.public.welcome',
      cloud: 'app.public.cloud',
      signin: 'app.public.signin',
      signout: 'app.public.signin'
    },
    private: {
      home: 'app.private.home',
      cloud: 'app.private.cloud',
      channel: 'app.private.channel'
    }
  };

  const DEFAULT_PUBLIC_STATE = app.public.welcome;
  const DEFAULT_PRIVATE_STATE = app.private.home;

  let go = function go(stateName, parameters) {
    return $state.go(stateName, parameters);
  };

  let navigate = function navigate(viewId) {
    if (isActiveView(viewId)) {
      return $q.when();
    }

    let toHome = viewId === 'home';
    let destination = toHome ?
      app.private.home : app.private.channel;

    let destinationParams = toHome ?
      undefined : { channelId: viewId };

    $ionicHistory.nextViewOptions({
      disableBack: true,
      disableAnimate: false
    });

    return go(destination, destinationParams)
      .then(() => state.save(
        state.cloud.navigation,
        ['activeViewId'],
        viewId
      ));
  };

  let isActiveView = function isActiveView(viewId) {
    return state.cloud.navigation.get('activeViewId') === viewId;
  };

  let at = function at(stateName, parameters) {
    return $state.is(stateName, parameters);
  };

  let setupRedirect = function setupRedirect() {
    // redirect to app.welcome if identity has not been initialized
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      let doRedirect;
      let redirectStateName;

      if (state.cloud.identity && state.cloud.identity.get()) {
        doRedirect = !isPrivateState(toState.name);
        redirectStateName = DEFAULT_PRIVATE_STATE;
      } else {
        doRedirect = isPrivateState(toState.name);
        redirectStateName = DEFAULT_PUBLIC_STATE;
      }

      if (!doRedirect) {
        return;
      }

      event.preventDefault();
      return go(redirectStateName);
    });

    return $q.when();
  };

  let clearCache = function clearCache() {
    return $ionicHistory.clearCache();
  };

  let isPrivateState = function isPrivateState(stateName) {
    if (stateName) {
      return stateName.startsWith('app.private');
    }

    return $state.includes('app.private');
  };

  let resetHistory = function resetHistory(options = {disableAnimate: false}) {
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true,
      disableAnimate: options.disableAnimate
    });
    return $q.when();
  };

  let initializePublic = function initializePublic() {
    let prepareNavigate = !at(app.public.welcome) ?
      resetHistory({disableAnimate: true}) :
      $q.when();

    return prepareNavigate
      .then(() => go(app.public.welcome))
      //workaround for too early initialization
      .then(() => $timeout(() => clearCache(), 0));
  };

  let initialize =
    function initializeNavigation() {
      let activeViewId = state.cloud.navigation.get('activeViewId');

      if (activeViewId === undefined) {
        return resetHistory()
          .then(() => go(DEFAULT_PRIVATE_STATE))
          .then(() => state.save(
            state.cloud.navigation,
            ['activeViewId'],
            'home'
          ));
      }

      if (activeViewId.startsWith('toc-')) {
        return resetHistory()
          .then(() => go(
            app.private.channel,
            {channelId: activeViewId}
          ));
      }

      return resetHistory()
        .then(() => go(DEFAULT_PRIVATE_STATE));
    };

  return {
    app,
    go,
    at,
    navigate,
    isActiveView,
    isPrivateState,
    clearCache,
    setupRedirect,
    resetHistory,
    initializePublic,
    initialize
  };
}
