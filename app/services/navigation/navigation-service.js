export default function navigation(state, $state, $q, R, $ionicHistory,
  $rootScope) {
  let privateStates = [
    'app.home',
    'app.channel'
  ];

  let publicStates = [
    'app.signin',
    'app.signup'
  ];

  let setupRedirect = function setupRedirect() {
    // redirect to app.welcome if identity has not been initialized
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      let doRedirect;
      let redirectStateName;

      if (state.cloud.identity && state.cloud.identity.get()) {
        doRedirect = isPublicState(toState.name);
        redirectStateName = 'app.home';
      } else {
        doRedirect = isPrivateState(toState.name);
        redirectStateName = 'app.welcome';
      }

      if (!doRedirect) {
        return;
      }

      event.preventDefault();
      return $state.go(redirectStateName);
    });
  };

  let clearCache = function clearCache() {
    return $ionicHistory.clearCache();
  };

  let isPrivateState = function isPrivateState(stateName) {
    let stateIncludes = stateName ?
      (otherState) => stateName.startsWith(otherState) :
      $state.includes;

    return R.any(stateIncludes)(privateStates);
  };

  let isPublicState = function isPublicState(stateName) {
    let stateIncludes = stateName ?
      (otherState) => stateName.startsWith(otherState) :
      $state.includes;

    return R.any(stateIncludes)(publicStates);
  };

  let resetHistory = function resetHistory(options = {disableAnimate: false}) {
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true,
      disableAnimate: options.disableAnimate
    });
    return $q.when();
  };

  let initialize = function initializeNavigation(initialState = 'app.home') {
    return resetHistory()
      .then(() => $state.go(initialState));
  };

  return {
    isPrivateState,
    isPublicState,
    clearCache,
    setupRedirect,
    resetHistory,
    initialize
  };
}
