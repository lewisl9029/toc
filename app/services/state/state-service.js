export default function state() {
  let stateService = {};

  stateService.initialize = function initializeState() {
    state.users = new Map();
  };

  return stateService;
}
