export default function navigation($state, R) {
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

  let isPublicState = function isPrivateState(stateName) {
    let stateIncludes = stateName ?
      (otherState) => stateName.startsWith(otherState) :
      $state.includes;

    return R.any(stateIncludes)(publicStates);
  };

  return {
    isPrivateState,
    isPublicState
  };
}
