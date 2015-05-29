export default function navigation($state, R) {
  let privateStates = [
    'app.home',
    'app.channel'
  ];

  let isPrivateState = function isPrivateState(stateName) {
    let stateIncludes = stateName ?
      (otherState) => stateName.startsWith(otherState) :
      $state.includes;

    return R.any(stateIncludes)(privateStates);
  };

  return {
    isPrivateState
  };
}
