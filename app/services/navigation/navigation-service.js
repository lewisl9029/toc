export default function navigation(state, $state, $q, R, $ionicHistory,
  $rootScope) {
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

  let at = function at(stateName) {
    return $state.is(stateName);
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

  let initialize =
    function initializeNavigation(initialState = app.private.home) {
      return resetHistory()
        .then(() => go(initialState));
    };

  return {
    app,
    go,
    at,
    isPrivateState,
    clearCache,
    setupRedirect,
    resetHistory,
    initialize
  };
}
