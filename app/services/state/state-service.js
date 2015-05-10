export default function state($rootScope, $q, storage, R, Baobab) {
  let getStatePath = R.split(storage.KEY_SEPARATOR);

  let stateService = {};

  // local application state persisted in-memory only
  stateService.transient = {};

  // local application state persisted in localStorage
  stateService.persistent = {
    tree: new Baobab({})
  };

  stateService.persistent.cursors = {
    identity: stateService.persistent.tree.select(['identity'])
  };

  // shared user application state persisted in indexedDB with remoteStorage
  stateService.synchronized = {
    tree: new Baobab({})
  };

  stateService.synchronized.cursors = {
    contacts: stateService.synchronized.tree.select(['contacts']),
    identity: stateService.synchronized.tree.select(['identity']),
    network: stateService.synchronized.tree.select(['network'])
  };

  stateService.persistent.tree.on('update',
    () => setTimeout(() => $rootScope.$apply())
  );
  stateService.synchronized.tree.on('update',
    () => setTimeout(() => $rootScope.$apply())
  );

  //TODO: create schema object and keep up to date for each tree

  let savePersistent =
    function savePersistent(cursor, relativePath, object, store) {
      let storageKey = storage.getStorageKey(
        R.concat(cursor.path, relativePath)
      );

      return store.storeObject(storageKey, object)
        .then(object => {
          if (cursor.get() === undefined) {
            cursor.tree.set(cursor.path, {});
            cursor.tree.commit();
          }

          cursor.set(relativePath, object);
          return object;
        });
    };

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

    return store.getAllObjects()
      .then((keyObjectPairs) => {
        R.forEach(keyObjectPair => state.tree.set(
          getStatePath(keyObjectPair[0]),
          keyObjectPair[1]
        ))(keyObjectPairs);
        state.tree.commit();
      });
  };

  let initializePersistent = function initializePersistent(moduleName) {
    let store = storage.createLocal(moduleName);

    return initializeStore(stateService.persistent, store);
  };

  let initializeSynchronized = function initializeSynchronized(moduleName) {
    //TODO: reset state tree before loading keys
    //TODO: figure out how to remove modules for logging out
    let store = storage.createRemote(moduleName);
    storage.claimAccess(moduleName);
    store.onChange(handleChangeSynchronized);

    return initializeStore(stateService.synchronized, store);
  };

  stateService.persistent.initialize = initializePersistent;
  stateService.synchronized.initialize = initializeSynchronized;

  const TREE_TO_STATE = new Map([
    [stateService.persistent.tree, stateService.persistent],
    [stateService.synchronized.tree, stateService.synchronized]
  ]);

  let save = function save(cursor, relativePath, object) {
    let state = TREE_TO_STATE.get(cursor.tree);
    return state.save(cursor, relativePath, object, state.store);
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
