export default function state(storage, R, Baobab) {
  //TODO: apply new formatting to existing modules
  const STORAGE_MODULE_PREFIX = 'toc-state-';

  let store;

  // local application state stored in-memory only
  let transientTree = new Baobab({});

  // local application state persisted in local storage
  let persistentTree = new Baobab({});

  // remote application state persisted in indexeddb with remotestorage
  let synchronizedTree = new Baobab({});

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

  let saveSynchronizedState = function saveState(path, object) {
    //TODO: wrap promises with $q.when to tie into digest cycle
    return store.storeObject(path, object).then(
      () => updateTree(path, object)
    );
  };

  let handleSynchronizedChange = function handleSynchronizedChange(event) {
    if (event.oldValue === event.newValue) {
      return;
    }

    updateTree(event.relativePath, event.newValue);
    console.dir(tree); //DEBUG
  };

  let remove = function removeState(path) {

  };

  let reset = function resetState() {

  };

  let initializeRemote = function initializeRemoteState(userId) {
    //TODO: reset state tree
    storageModuleName = STORAGE_MODULE_PREFIX + userId;
    store = storage.createModule(storageModuleName);
    storage.claimAccess(storageModuleName);
    store.onChange(handleChange);
    // store.storeObject('identity/test', 'test')
    // .then(()=>{
    var test = store.getAllObjects()
      .then(objects => {
        console.dir(objects);
      });
    // })

    //TODO: load all keys into tree
  };

  return {
    transient,
    persistent,
    synchronized,
    save,
    initialize
  };
}
