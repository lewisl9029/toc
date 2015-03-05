export default function state(storage) {
  let stateService = {};

  const STORAGE_MODULE_NAME = 'toc-state';

  let store = storage.createModule(STORAGE_MODULE_NAME);

  let cache = {};

  let save = function saveState(key, value) {
    store.storeObject(key, value).then(() => {
      return test;
    });
    return
  };

  let initialize = function initializeState() {
    storage.claimAccess(STORAGE_MODULE_NAME);
  };

  stateService.STORAGE_MODULE_NAME = STORAGE_MODULE_NAME;
  stateService.store = store;
  stateService.cache = cache;
  stateService.initialize = initialize;

  return stateService;
}
