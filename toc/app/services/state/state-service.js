export let serviceName = 'state';
export default /*@ngInject*/ function state(
  $log,
  $q,
  $rootScope,
  $window,
  $timeout,
  Baobab,
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
    },
    {
      immutable: !$window.tocProd
    });

  // baobab update events are batched, so this approach is reasonably performant
  // TODO: try updating on requestAnimationFrame instead?
  stateService.tree.on('update',
    () => $timeout(() => $rootScope.$apply(), 0, false)
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

  stateService.memory.notifications = stateService.memory.cursor
    .select(['notifications']);

  stateService.local.cryptography = stateService.local.cursor
    .select(['cryptography']);
  stateService.local.contacts = stateService.local.cursor
    .select(['contacts']);
  stateService.local.identity = stateService.local.cursor
    .select(['identity']);
  stateService.local.session = stateService.local.cursor
    .select(['session']);
  stateService.local.devices = stateService.local.cursor
    .select(['devices']);

  stateService.cloudUnencrypted.cryptography = stateService.cloudUnencrypted
    .cursor.select(['cryptography']);
  stateService.cloudUnencrypted.identity = stateService.cloudUnencrypted
    .cursor.select(['identity']);
  stateService.cloudUnencrypted.session = stateService.cloudUnencrypted
    .cursor.select(['session']);
  stateService.cloudUnencrypted.state = stateService.cloudUnencrypted
    .cursor.select(['state']);

  stateService.cloud.buffer = stateService.cloud.cursor
    .select(['buffer']);
  stateService.cloud.identity = stateService.cloud.cursor
    .select(['identity']);
  stateService.cloud.contacts = stateService.cloud.cursor
    .select(['contacts']);
  stateService.cloud.channels = stateService.cloud.cursor
    .select(['channels']);
  stateService.cloud.messages = stateService.cloud.cursor
    .select(['messages']);
  stateService.cloud.devices = stateService.cloud.cursor
    .select(['devices']);
  stateService.cloud.network = stateService.cloud.cursor
    .select(['network']);
  stateService.cloud.navigation = stateService.cloud.cursor
    .select(['navigation']);
  stateService.cloud.notifications = stateService.cloud.cursor
    .select(['notifications']);
  stateService.cloud.session = stateService.cloud.cursor
    .select(['session']);
  stateService.cloud.status = stateService.cloud.cursor
    .select(['status']);

  let saveVolatile =
    function saveVolatile(cursor, relativePath, object) {
      return $q.when()
        .then(() => {
          cursor.set(relativePath, object);
          return object;
        });
    };

  let savePersistent =
    function savePersistent(cursor, relativePath, object, store) {
      let storageKey = storage.getStorageKey(
        // path[0] is the store namespace i.e. memory, local, cloud, etc
        R.concat(R.drop(1, cursor.path), relativePath)
      );

      return store.storeObject(storageKey, object)
        .then(object => {
          cursor.set(relativePath, object);
          return object;
        });
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
        });
    };

  let removePersistent =
    function removePersistent(cursor, relativePath, store) {
      //FIXME: doesn't work for removing cursor without providing relativePath
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
        }).catch($log.error);
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

  //FIXME: removing objects doesnt always work as expected
  // see https://github.com/lewisl9029/toc/issues/233
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
    // cloud init has to be done later due to need for password to decrypt
  };

  let destroy = function destroy() {
    return stateService.local.store.removeAllObjects()
      // we shouldn't try to clear remote objects.
      // sync at wrong time could cause corrupted cloud data.
      // .then(() => stateService.cloudUnencrypted.store.removeAllObjects())
      // .then(() => stateService.cloud.store.removeAllObjects())
      .then(() => storage.destroy());
  };

  stateService.save = save;
  stateService.remove = remove;
  stateService.commit = commit;
  stateService.initialize = initialize;
  stateService.destroy = destroy;

  return stateService;
}
