export default function navigation($state, $q, R, $ionicHistory) {
  let privateStates = [
    'app.home',
    'app.channel'
  ];

  let publicStates = [
    'app.signin',
    'app.signup'
  ];

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

  let resetHistory = function resetHistory() {
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true
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
    resetHistory,
    initialize
  };
}
