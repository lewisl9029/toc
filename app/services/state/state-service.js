export default function state(storage) {
  let stateService = {};

  stateService.initialize = function initializeState() {
    stateService.current = storage.buildModule('state');
  };

  return stateService;
}
