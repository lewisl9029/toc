export let serviceName = 'state';
export default /*@ngInject*/ function state(
  $q,
  $rootScope,
  $window,
  Baobab,
  notification,
  R,
  storage
) {
  let getStatePath = R.split(storage.KEY_SEPARATOR);

  let stateService = {};

  //DEBUG
  // Can call window.tocState.destroy() to reset all app data
  $window.tocState = stateService;
  $window.baobab = Baobab;

  stateService.tree = new Baobab({
    memory: {},
    local: {},
    cloudUnencrypted: {},
    cloud: {}
  });

  //TODO: test baobab event batching and tweak manual commit timing
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
    stateService.local.session = stateService.local.cursor
      .select([userId, 'session']);
    stateService.local.devices = stateService.local.cursor
      .select([userId, 'devices']);

    stateService.cloudUnencrypted.identity = stateService.cloudUnencrypted
      .cursor.select([userId, 'identity']);
    stateService.cloudUnencrypted.session = stateService.cloudUnencrypted
      .cursor.select([userId, 'session']);
    stateService.cloudUnencrypted.state = stateService.cloudUnencrypted.cursor
      .select([userId, 'state']);

    stateService.cloud.identity = stateService.cloud.cursor
      .select([userId, 'identity']);
    stateService.cloud.contacts = stateService.cloud.cursor
      .select([userId, 'contacts']);
    stateService.cloud.channels = stateService.cloud.cursor
      .select([userId, 'channels']);
    stateService.cloud.messages = stateService.cloud.cursor
      .select([userId, 'messages']);
    stateService.cloud.devices = stateService.cloud.cursor
      .select([userId, 'devices']);
    stateService.cloud.network = stateService.cloud.cursor
      .select([userId, 'network']);
    stateService.cloud.navigation = stateService.cloud.cursor
      .select([userId, 'navigation']);
    stateService.cloud.session = stateService.cloud.cursor
      .select([userId, 'session']);
    stateService.cloud.status = stateService.cloud.cursor
      .select([userId, 'status']);
  };

  let destroyUserCursors = function destroyUserCursors() {
    stateService.local.identity = undefined;
    stateService.local.session = undefined;
    stateService.local.devices = undefined;

    stateService.cloudUnencrypted.identity = undefined;
    stateService.cloudUnencrypted.session = undefined;
    stateService.cloudUnencrypted.state = undefined;

    stateService.cloud.identity = undefined;
    stateService.cloud.contacts = undefined;
    stateService.cloud.devices = undefined;
    stateService.cloud.network = undefined;
    stateService.cloud.navigation = undefined;
    stateService.cloud.session = undefined;
    stateService.cloud.channels = undefined;
    stateService.cloud.status = undefined;
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
        R.concat(R.drop(1, cursor.path), relativePath)
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
        R.concat(R.drop(1, cursor.path), relativePath)
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

  let addListener = function addListener(cursor, handleUpdate, scope, options) {
    if (!options || !options.skipInitialize) {
      handleUpdate();
    }

    cursor.on('update', handleUpdate);

    if (scope) {
      scope.$on('destroy', () => cursor.off('update', handleUpdate));
    }
  };

  let handleChangeCloud = function handleChangeCloud(event) {
    if (event.oldValue === event.newValue) {
      return;
    }

    stateService.cloud.cursor.set(
      getStatePath(event.relativePath),
      event.newValue
    );
  };

  // TODO: refactor to use single password per storage account
  // to reduce dependence on this (only unencrypted data will be the salt)
  let handleChangeCloudUnencrypted =
    function handleChangeCloudUnencrypted(event) {
      if (event.oldValue === event.newValue) {
        return;
      }

      stateService.cloudUnencrypted.cursor.set(
        getStatePath(event.relativePath),
        event.newValue
      );
    };

  let initializeStore = function initializeStore(stateModule) {
    return stateModule.store.getAllObjects()
      .then((keyObjectPairs) => {
        R.forEach(keyObjectPair => stateModule.cursor.set(
          getStatePath(keyObjectPair[0]),
          keyObjectPair[1]
        ))(keyObjectPairs);
        stateModule.cursor.tree.commit();
        return keyObjectPairs;
      });
  };

  let initializeLocal = function initializeLocal() {
    return initializeStore(stateService.local);
  };

  let initializeCloud = function initializeCloud() {
    return initializeStore(stateService.cloud);
  };

  let initializeCloudUnencrypted = function initializeCloudUnencrypted() {
    return initializeStore(stateService.cloudUnencrypted);
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

  stateService.addListener = addListener;
  stateService.cloud.initialize = initializeCloud;

  let save = function save(cursor, relativePath, object) {
    let stateModule = stateService[cursor.path[0]];
    return stateModule.save(cursor, relativePath, object, stateModule.store);
  };

  let remove = function remove(cursor, relativePath) {
    let stateModule = stateService[cursor.path[0]];
    return stateModule.remove(cursor, relativePath, stateModule.store);
  };

  let commit = function commit() {
    stateService.tree.commit();
    return $q.when();
  };

  let initialize = function initialize() {
    storage.initialize();

    stateService.local.store = storage.local;
    stateService.cloudUnencrypted.store = storage.cloudUnencrypted;
    stateService.cloud.store = storage.cloud;

    storage.cloud.onChange(handleChangeCloud);
    storage.cloudUnencrypted.onChange(handleChangeCloudUnencrypted);
    return initializeLocal()
      .then(() => initializeCloudUnencrypted());
  };

  let destroy = function destroy() {
    return stateService.local.store.removeAllObjects()
      .then(() => stateService.cloudUnencrypted.store.removeAllObjects())
      .then(() => stateService.cloud.store.removeAllObjects())
      .then(() => storage.destroy());
  };

  stateService.save = save;
  stateService.remove = remove;
  stateService.commit = commit;
  stateService.initialize = initialize;
  stateService.destroy = destroy;

  return stateService;
}
