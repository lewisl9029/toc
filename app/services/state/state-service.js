export default function state(storage, R) {
  //TODO: apply new formatting to existing modules
  const STORAGE_MODULE_PREFIX = 'toc-state-';

  let store;
  let tree = {};
  let storageModuleName;

  //TODO: eventually replace with baobab tree

  //TODO: optimize for op/s and resource usage
  //FIXME: subpaths can shadow properties on higher-level objects and vice-versa
  let updateTree = function updateTree(path, object) {
    let pathComponents = R.pipe(
      R.split('/'),
      R.reject(R.eq(''))
    )(path);

    let initializeProperty = (obj, prop) => obj[prop] ?
      obj[prop] :
      obj[prop] = {};

    let parentObject = R.pipe(
      R.take(pathComponents.length - 1),
      R.reduce(initializeProperty, tree)
    )(pathComponents);

    parentObject[R.last(pathComponents)] = object;

    return object;
  };

  let save = function saveState(path, object) {
    //TODO: wrap promises with $q.when to tie into digest cycle
    return store.storeObject(path, object).then(
      () => updateTree(path, object)
    );
  };

  let handleChange = function handleStateChange(event) {
    if (event.oldValue === event.newValue) {
      return event.newValue;
    }

    updateTree(event.relativePath, event.newValue);
    console.dir(tree);
  };

  let remove = function removeState(path) {

  };

  let reset = function resetState() {

  };

  let initialize = function initializeState(userId) {
    //TODO: reset state tree
    storageModuleName = STORAGE_MODULE_PREFIX + userId;
    store = storage.createModule(storageModuleName);
    storage.claimAccess(storageModuleName);
    store.onChange(handleChange);
  };

  return {
    tree,
    save,
    initialize
  };
}
