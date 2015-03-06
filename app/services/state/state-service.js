export default function state(storage, R) {
  //TODO: apply new formatting to existing modules
  const STORAGE_MODULE_NAME = 'toc-state';

  //TODO: create separate state module for each user
  let store = storage.createModule(STORAGE_MODULE_NAME);

  let cache = {};

  //TODO: optimize for op/s and resource usage
  //FIXME: subpaths can shadow properties on higher-level objects and vice-versa
  let updateCache = function updateCache(path, object) {
    let pathComponents = R.pipe(
      R.split('/'),
      R.reject(R.eq(''))
    )(path);

    let initializeProperty = (obj, prop) => obj[prop] ?
      obj[prop] :
      obj[prop] = {};

    let parentObject = R.pipe(
      R.take(pathComponents.length - 1),
      R.reduce(initializeProperty, cache)
    )(pathComponents);

    parentObject[R.last(pathComponents)] = object;

    return object;
  };

  let save = function saveState(path, object) {
    //TODO: wrap promises with $q.when to tie into digest cycle
    return store.storeObject(path, object).then(
      () => updateCache(path, object)
    );
  };

  let handleChange = function handleStateChange(event) {
    if (event.oldValue === event.newValue) {
      return event.newValue;
    }

    updateCache(event.relativePath, event.newValue);
    console.dir(cache);
  };

  let initialize = function initializeState() {
    storage.claimAccess(STORAGE_MODULE_NAME);
    store.onChange(handleChange);
  };

  return {
    STORAGE_MODULE_NAME: STORAGE_MODULE_NAME,
    store: store,
    cache: cache,
    save: save,
    initialize: initialize
  };
}
