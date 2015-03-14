export default function state($q, storage, R, Baobab) {
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

  //TODO: create schema object and keep up to date for each tree

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

  let initializeStore = function initializeStore(state, store) {
    state.store = store;

    store.getAllObjects()
      .then(R.forEach(keyObjectPair =>
        state.tree.set(
          getStatePath(keyObjectPair[0]),
          keyObjectPair[1]
        )
      ));
  };

  let initializePersistent = function initializePersistent(moduleName) {
    let store = storage.createLocal(moduleName);

    initializeStore(stateService.persistent, store);
  };

  let initializeSynchronized = function initializeSynchronized(moduleName) {
    //TODO: reset state tree before loading keys
    //TODO: figure out how to remove modules for logging out
    let store = storage.createRemote(moduleName);
    storage.claimAccess(moduleName);
    store.onChange(handleChangeSynchronized);

    initializeStore(stateService.synchronized, store);
  };

  stateService.persistent.initialize = initializePersistent;
  stateService.synchronized.initialize = initializeSynchronized;

  const TREE_TO_STATE = new Map([
    [stateService.transient.tree, stateService.transient],
    [stateService.persistent.tree, stateService.persistent],
    [stateService.synchronized.tree, stateService.synchronized]
  ]);

  let save = function save(cursor, path, object) {
    let state = TREE_TO_STATE.get(cursor.root);
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
