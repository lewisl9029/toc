export default function state() {
  let stateService = {};

  stateService.initialize = function initializeState() {
    state.users = {};
  };

  return stateService;
}
