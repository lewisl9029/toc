export default function state(storage, R) {
  let stateService = {};

  const STORAGE_MODULE_NAME = 'toc-state';

  let store = storage.createModule(STORAGE_MODULE_NAME);

  let cache = {};

  let updateCache = function updateCache(path, object) {
    let pathComponents = R.split('/')(path);
    let initializeProperty = (obj, prop) => obj[prop] ?
      obj[prop] :
      obj[prop] = {};
    let parentComponents = R.take(pathComponents.length - 1)(pathComponents);
    let parentObject = R.reduce(initializeProperty, cache)(parentComponents);

    return parentObject[R.last(pathComponents)] = object;
  };

  let save = function saveState(path, object) {
    //TODO: wrap promises with $q.when to tie into digest cycle
    return store.storeObject(path, object).then(() => {
      return updateCache(path, object)
    });
  };

  let handleChange = function handleStateChange(event) {
    updateCache(event.relativePath, event.newValue);
  };

  let initialize = function initializeState() {
    storage.claimAccess(STORAGE_MODULE_NAME);
  };

  stateService.STORAGE_MODULE_NAME = STORAGE_MODULE_NAME;
  stateService.store = store;
  stateService.cache = cache;
  stateService.save = save;
  stateService.initialize = initialize;

  return stateService;
}
