export default function state($rootScope, $q, $window, storage, R, Baobab,
  notification) {
  let getStatePath = R.split(storage.KEY_SEPARATOR);

  let stateService = {};

  $window.state = stateService;

  // local application state persisted in-memory only
  stateService.memory = {
    tree: new Baobab({})
  };

  stateService.memory.cursors = {
    identity: stateService.memory.tree.select(['identity'])
  };

  stateService.memory.tree.on('update',
    () => setTimeout(() => $rootScope.$apply())
  );

  // local application state persisted in localStorage
  stateService.local = {
    tree: new Baobab({})
  };

  stateService.local.tree.on('update',
    () => setTimeout(() => $rootScope.$apply())
  );

  // unencrypted application state persisted in indexedDB with remoteStorage
  stateService.cloudUnencrypted = {
    tree: new Baobab({})
  };

  stateService.cloudUnencrypted.tree.on('update',
    () => setTimeout(() => $rootScope.$apply())
  );

  // encrypted application state persisted in indexedDB with remoteStorage
  stateService.cloud = {
    tree: new Baobab({})
  };

  stateService.cloud.tree.on('update',
    () => setTimeout(() => $rootScope.$apply())
  );

  let initializeCursors = function updateCursors(userId) {
    stateService.local.cursors = {
      identity: stateService.local.tree.select([userId, 'identity'])
    };

    stateService.cloudUnencrypted.cursors = {
      identity: stateService.cloudUnencrypted.tree.select([userId, 'identity'])
    };

    stateService.cloud.cursors = {
      contacts: stateService.cloud.tree.select([userId, 'contacts']),
      identity: stateService.cloud.tree.select([userId, 'identity']),
      network: stateService.cloud.tree.select([userId, 'network'])
    };
  };

  let destroyCursors = function destroyCursors() {
    stateService.local.cursors = undefined;
    stateService.cloudUnencrypted.cursors = undefined;
    stateService.cloud.cursors = undefined;
  };

  stateService.initializeCursors = initializeCursors;
  stateService.destroyCursors = destroyCursors;

  let saveVolatile =
    function saveVolatile(cursor, relativePath, object) {
      return $q.when()
        .then(() => {
          if (cursor.get() === undefined) {
            cursor.tree.set(cursor.path, {});
            cursor.tree.commit();
          }

          cursor.set(relativePath, object);
          return object;
        })
        .catch((error) => notification.error(error, 'State Save Error'));
    };

  //TODO: create schema object and keep up to date for each tree
  let savePersistent =
    function savePersistent(cursor, relativePath, object, store) {
      let storageKey = storage.getStorageKey(
        R.concat(cursor.path, relativePath)
      );

      return store.storeObject(storageKey, object)
        .then(object => {
          //FIXME: workaround for setting nonexistant cursors
          // this can't be very performant
          if (cursor.get() === undefined) {
            cursor.tree.set(cursor.path, {});
            cursor.tree.commit();
          }

          cursor.set(relativePath, object);
          return object;
        })
        .catch((error) => notification.error(error, 'State Save Error'));
    };

  let removeVolatile =
    function removeVolatile(cursor, relativePath) {
      if (cursor.get() === undefined) {
        return $q.when();
      }

      return $q.when()
        .then(() => {
          cursor.unset(relativePath);
          return relativePath;
        })
        .catch((error) => notification.error(error, 'State Delete Error'));
    };

  let removePersistent =
    function removePersistent(cursor, relativePath, store) {
      let storageKey = storage.getStorageKey(
        R.concat(cursor.path, relativePath)
      );

      if (cursor.get() === undefined) {
        return $q.when();
      }

      return store.removeObject(storageKey)
        .then((key) => {
          cursor.unset(relativePath);
          return key;
        })
        .catch((error) => notification.error(error, 'State Delete Error'));
    };

  stateService.memory.save = saveVolatile;
  stateService.local.save = savePersistent;
  stateService.cloudUnencrypted.save = savePersistent;
  stateService.cloud.save = savePersistent;

  stateService.memory.remove = removeVolatile;
  stateService.local.remove = removePersistent;
  stateService.cloudUnencrypted.remove = removePersistent;
  stateService.cloud.remove = removePersistent;

  let handleChangeCloud = function handleChangeCloud(event) {
    if (event.oldValue === event.newValue) {
      return;
    }

    stateService.cloud.tree.set(
      getStatePath(event.relativePath),
      event.newValue
    );
  };

  let handleChangeCloudUnencrypted =
    function handleChangeCloudUnencrypted(event) {
      if (event.oldValue === event.newValue) {
        return;
      }

      stateService.cloudUnencrypted.tree.set(
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
        return keyObjectPairs;
      });
  };

  let initializeLocal = function initializeLocal() {
  };

  let initializeCloud = function initializeCloud() {
    //TODO: reset state tree before loading keys
    //TODO: figure out how to remove modules for logging out
    return initializeStore(stateService.cloud, storage.cloud);
  };

  let initializeCloudUnencrypted = function initializeCloudUnencrypted() {
    return initializeStore(
      stateService.cloudUnencrypted,
      storage.cloudUnencrypted
    );
  };

  stateService.local.initialize = initializeLocal;
  stateService.cloudUnencrypted.initialize = initializeCloudUnencrypted;
  stateService.cloud.initialize = initializeCloud;

  const TREE_TO_STATE = new Map([
    [stateService.memory.tree, stateService.memory],
    [stateService.local.tree, stateService.local],
    [stateService.cloudUnencrypted.tree, stateService.cloudUnencrypted],
    [stateService.cloud.tree, stateService.cloud]
  ]);

  let save = function save(cursor, relativePath, object) {
    let state = TREE_TO_STATE.get(cursor.tree);
    return state.save(cursor, relativePath, object, state.store);
  };

  let remove = function remove(cursor, relativePath) {
    let state = TREE_TO_STATE.get(cursor.tree);
    return state.remove(cursor, relativePath, state.store);
  };

  let initialize = function initialize() {
    storage.initialize();

    storage.cloud.onChange(handleChangeCloud);
    storage.cloudUnencrypted.onChange(handleChangeCloudUnencrypted);
    return initializeStore(stateService.local, storage.local)
      .then(() => initializeStore(
        stateService.cloudUnencrypted,
        storage.cloudUnencrypted
      ));
  };

  let reset = function resetState() {

  };

  stateService.save = save;
  stateService.remove = remove;
  stateService.initialize = initialize;

  return stateService;
}
