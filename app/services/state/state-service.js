export default function state($q, storage, R, Baobab) {
  const STORAGE_MODULE_PREFIX = 'toc-state-';

  let getStatePath = R.split(storage.KEY_SEPARATOR);

  let stateService = {};

  // local application state persisted in-memory only
  stateService.transient = {
    tree: new Baobab({})
  };

  // local application state persisted in localStorage
  stateService.persistent = {
    tree: new Baobab({})
  };

  // shared user application state persisted in indexedDB with remoteStorage
  stateService.synchronized = {
    tree: new Baobab({})
  };

  let saveTransient = function saveTransient(cursor, path, object) {
    return $q.when(cursor.set(path, object));
  };

  let savePersistent =
    function savePersistent(cursor, path, object, store) {
      let storageKey = storage.getStorageKey(R.concat(cursor.path, path));

      return store.storeObject(storageKey, object)
        .then(object => cursor.set(path, object));
    };

  stateService.transient.save = saveTransient;
  stateService.persistent.save = savePersistent;
  stateService.synchronized.save = savePersistent;

  let handleChangeSynchronized = function handleChangeSynchronized(event) {
    if (event.oldValue === event.newValue) {
      return;
    }

    stateService.synchronized.tree.set(
      getStatePath(event.relativePath),
      event.newValue
    );
  };

  // let initializeTransient = function initializeTransient() {
  // };
  //TODO: implement versioning of state tree schema
  // perform migration and/or prompt for app update in initialization methods
  let initializePersistent = function initializePersistent(userId) {
    let store = storage.local;

    stateService.persistent.store = store;

    R.forEach(key =>
      stateService.persistent.tree.set(
        getStatePath(key),
        store.getObjectSync(key)
      )
    )(Object.keys(store));
  };

  let initializeSynchronized = function initializeSynchronized(userId) {
    //TODO: reset state tree before loading keys
    //TODO: figure out how to remove modules for logging out
    let storageModuleName = STORAGE_MODULE_PREFIX + userId;
    let store = storage.createModule(storageModuleName);
    storage.claimAccess(storageModuleName);
    store.onChange(handleChangeSynchronized);

    stateService.synchronized.store = store;

    store.getAllObjects()
      .then(R.forEach(keyObjectPair =>
        stateService.synchronized.tree.set(
          getStatePath(keyObjectPair[0]),
          keyObjectPair[1]
        )
      ));
  };

  stateService.persistent.initialize = initializePersistent;
  stateService.synchronized.initialize = initializeSynchronized;

  const TREE_TO_STATE = new Map([
    [stateService.transient.tree, stateService.transient],
    [stateService.persistent.tree, stateService.persistent],
    [stateService.synchronized.tree, stateService.synchronized]
  ]);

  let save = function save(cursor, path, object) {
    let state = TREE_TO_STATE[cursor.root];
    return state.save(cursor, path, object, state.store);
  };

  let initialize = function initialize() {
    initializePersistent();
  };

  let remove = function removeState(path) {

  };

  let reset = function resetState() {

  };

  stateService.save = save;
  stateService.initialize = initialize;

  return stateService;
}
