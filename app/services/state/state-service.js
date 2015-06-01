export default function state($rootScope, $q, $window, storage, R, Baobab,
  notification) {
  let getStatePath = R.split(storage.KEY_SEPARATOR);

  let stateService = {};

  //DEBUG
  $window.tocState = stateService;
  $window.baobab = Baobab;

  stateService.tree = new Baobab({});

  stateService.tree.on('update',
    () => setTimeout(() => $rootScope.$apply())
  );

  stateService.version = '0.3.0';

  // local application state persisted in-memory only
  stateService.memory = {
    cursor: stateService.tree.select(['memory'])
  };

  // local application state persisted in localStorage
  stateService.local = {
    cursor: stateService.tree.select(['local'])
  };

  // unencrypted application state persisted in indexedDB with remoteStorage
  stateService.cloudUnencrypted = {
    cursor: stateService.tree.select(['cloudUnencrypted'])
  };

  // encrypted application state persisted in indexedDB with remoteStorage
  stateService.cloud = {
    cursor: stateService.tree.select(['cloud'])
  };

  let initializeUserCursors = function initializeUserCursors(userId) {
    stateService.local.identity = stateService.local.cursor
      .select([userId, 'identity']);

    stateService.cloudUnencrypted.identity = stateService.cloudUnencrypted
      .cursor.select([userId, 'identity']);

    stateService.cloud.identity = stateService.cloud.cursor
      .select([userId, 'identity']);
    stateService.cloud.contacts = stateService.cloud.cursor
      .select([userId, 'contacts']);
    stateService.cloud.network = stateService.cloud.cursor
      .select([userId, 'network']);
    stateService.cloud.state = stateService.cloud.cursor
      .select([userId, 'state']);
  };

  let destroyUserCursors = function destroyUserCursors() {
    stateService.local.identity = undefined;

    stateService.cloudUnencrypted.identity = undefined;

    stateService.cloud.identity = undefined;
    stateService.cloud.contacts = undefined;
    stateService.cloud.network = undefined;
    stateService.cloud.state = undefined;
  };

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

  let initializeStore = function initializeStore(stateModule, store) {
    stateModule.store = store;

    return store.getAllObjects()
      .then((keyObjectPairs) => {
        R.forEach(keyObjectPair => stateModule.cursor.set(
          getStatePath(keyObjectPair[0]),
          keyObjectPair[1]
        ))(keyObjectPairs);
        stateModule.cursor.commit();
        return keyObjectPairs;
      });
  };

  let initializeCloud = function initializeCloud() {
    return initializeStore(stateService.cloud, storage.cloud);
  };

  let initializeCloudUnencrypted = function initializeCloudUnencrypted() {
    return initializeStore(
      stateService.cloudUnencrypted,
      storage.cloudUnencrypted
    );
  };

  stateService.initializeUserCursors = initializeUserCursors;
  stateService.destroyUserCursors = destroyUserCursors;

  stateService.memory.save = saveVolatile;
  stateService.local.save = savePersistent;
  stateService.cloudUnencrypted.save = savePersistent;
  stateService.cloud.save = savePersistent;

  stateService.memory.remove = removeVolatile;
  stateService.local.remove = removePersistent;
  stateService.cloudUnencrypted.remove = removePersistent;
  stateService.cloud.remove = removePersistent;

  stateService.cloudUnencrypted.initialize = initializeCloudUnencrypted;
  stateService.cloud.initialize = initializeCloud;

  let save = function save(cursor, relativePath, object) {
    let stateModule = stateService[cursor.path[0]];
    return stateModule.save(cursor, relativePath, object, stateModule.store);
  };

  let remove = function remove(cursor, relativePath) {
    let stateModule = stateService[cursor.path[0]];
    return stateModule.remove(cursor, relativePath, stateModule.store);
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

  stateService.save = save;
  stateService.remove = remove;
  stateService.initialize = initialize;

  return stateService;
}
