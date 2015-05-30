export default function storage($window, $q, remoteStorage, cryptography, R,
  notification) {
  //FIXME: storage usage is extremely high due to really long keys + storing
  // crypto settings with each item/key
  const DEFAULT_ACCESS_LEVEL = 'rw';
  const STORAGE_MODULE_PREFIX = 'toc-state-';
  const KEY_SEPARATOR = '.';


  let getStorageKey = R.join(KEY_SEPARATOR);

  let connect = function connect(email) {
    return remoteStorage.remoteStorage.connect(email);
  };

  let isConnected = function isConnected() {
    return remoteStorage.remoteStorage.connected;
  };

  let prepare = function prepareStorage() {
    let deferredStorageReady = $q.defer();

    remoteStorage.remoteStorage.on(
      'ready',
      () => deferredStorageReady.resolve()
    );

    return deferredStorageReady.promise;
  };

  let enableLog = remoteStorage.remoteStorage.enableLog;

  let claimAccess =
    function claimAccess(moduleName, accessLevel = DEFAULT_ACCESS_LEVEL) {
      remoteStorage.remoteStorage.access
        .claim(STORAGE_MODULE_PREFIX + moduleName, accessLevel);
    };

  let buildModule = function buildModule(privateClient) {
    privateClient.declareType(
      cryptography.ENCRYPTED_OBJECT.name,
      cryptography.ENCRYPTED_OBJECT.schema
    );

    let storeObject = function storeObject(key, object) {
      let encryptedObject = cryptography.encrypt(object);
      let encryptedKey = cryptography.escapeBase64(
        JSON.stringify(cryptography.encryptDeterministic(key))
      );

      return $q.when(privateClient.storeObject(
        cryptography.ENCRYPTED_OBJECT.name,
        encryptedKey,
        encryptedObject
      )).then(() => object);
    };

    let getObject = function getObject(key) {
      let encryptedKey = cryptography.escapeBase64(
        JSON.stringify(cryptography.encryptDeterministic(key))
      );

      return $q.when(privateClient.getObject(encryptedKey, false))
        .then(cryptography.decrypt);
    };

    let removeObject = function removeObject(key) {
      let encryptedKey = cryptography.escapeBase64(
        JSON.stringify(cryptography.encryptDeterministic(key))
      );

      return $q.when(privateClient.remove(encryptedKey))
        .then(() => key);
    };

    let getAllObjects = function getAllObjects() {
      //all encrypted paths are under root
      let key = '';

      return $q.when(privateClient.getAll(key, false))
        .then((encryptedKeyObjectMap) => {
          let decryptedKeyObjectPairs = R.pipe(
            R.toPairs,
            R.map(encryptedKeyObjectPair => {
              let decryptedKeyObjectPair;

              try {
                decryptedKeyObjectPair = [
                  cryptography.decrypt(
                    JSON.parse(cryptography.unescapeBase64(encryptedKeyObjectPair[0]))
                  ),
                  cryptography.decrypt(encryptedKeyObjectPair[1])
                ];
              }
              catch (error) {
                // Assuming failed decryption indicates data belonging to
                // a different account and filter out
                if (error.message === 'cryptography: decryption failed') {
                  return undefined;
                }

                notification.error(error.message, 'Storage Get Error');
                return undefined;
              }

              return decryptedKeyObjectPair;
            }),
            R.filter((keyObjectPair) => keyObjectPair !== undefined)
          )(encryptedKeyObjectMap);

          return decryptedKeyObjectPairs;
        });
    };

    let onChange = function onChange(handleChange) {
      privateClient.on('change', function handleStorageChange(event) {
        if (!cryptography.isInitialized()) {
          return;
        }

        try {
          let decryptedEvent = Object.assign({}, event);

          decryptedEvent.relativePath = event.relativePath ?
            cryptography.decrypt(
              JSON.parse(cryptography.unescapeBase64(event.relativePath))
            ) :
            event.relativePath;

          decryptedEvent.newValue = event.newValue ?
            cryptography.decrypt(event.newValue) :
            event.newValue;

          decryptedEvent.oldValue = event.oldValue ?
            cryptography.decrypt(event.oldValue) :
            event.oldValue;

          handleChange(decryptedEvent);
        }
        catch (error) {
          // Assuming failed decryption indicates data belonging to
          // a different account and ignore
          if (error.message === 'cryptography: decryption failed') {
            return;
          }

          return notification.error(error.message, 'Storage Sync Error');
        }
      });
    };

    let initialize = function initialize() {
      privateClient.cache('');
    };

    return {
      exports: {
        storeObject,
        getObject,
        removeObject,
        getAllObjects,
        onChange,
        initialize
      }
    };
  };

  let buildModuleUnencrypted = function buildModuleUnencrypted(privateClient) {
    privateClient.declareType(
      cryptography.UNENCRYPTED_OBJECT.name,
      cryptography.UNENCRYPTED_OBJECT.schema
    );

    let storeObject = function storeObject(key, object) {
      let unencryptedObject = {
        pt: JSON.stringify(object)
      };

      return $q.when(privateClient.storeObject(
          cryptography.UNENCRYPTED_OBJECT.name,
          key,
          unencryptedObject
        ))
        .then(() => object);
    };

    let getObject = function getObject(key) {
      return $q.when(privateClient.getObject(key, false))
        .then(unencryptedObject => JSON.parse(unencryptedObject.pt));
    };

    let removeObject = function removeObject(key) {
      return $q.when(privateClient.remove(key))
        .then(() => key);
    };

    let getAllObjects = function getAllObjects() {
      //all encrypted paths are under root
      let key = '';

      return $q.when(privateClient.getAll(key, false))
        .then((keyObjectMap) => {
          let keyObjectPairs = R.pipe(
            R.toPairs,
            R.map(keyObjectPair => [
              keyObjectPair[0],
              JSON.parse(keyObjectPair[1].pt)
            ])
          )(keyObjectMap);

          return keyObjectPairs;
        });
    };

    let onChange = function onChange(handleChange) {
      privateClient.on('change', function handleStorageChange(event) {
        let unwrappedEvent = Object.assign({}, event);

        unwrappedEvent.newValue = event.newValue ?
          JSON.parse(event.newValue.pt) :
          event.newValue;

        unwrappedEvent.oldValue = event.oldValue ?
          JSON.parse(event.oldValue.pt) :
          event.oldValue;

        handleChange(unwrappedEvent);
      });
    };

    let initialize = function initialize() {
      privateClient.cache('');
    };

    return {
      exports: {
        storeObject,
        getObject,
        removeObject,
        getAllObjects,
        onChange,
        initialize
      }
    };
  };

  let createLocal = function createLocal(moduleName = 'local') {
    const KEY_PREFIX = STORAGE_MODULE_PREFIX + moduleName + KEY_SEPARATOR;

    let getObject = function getObjectLocal(key) {
      let object = JSON.parse($window.localStorage.getItem(KEY_PREFIX + key));
      return $q.when(object);
    };

    let getObjectSync = function getObjectSyncLocal(key) {
      return JSON.parse($window.localStorage.getItem(KEY_PREFIX + key));
    };

    let removeObject = function removeObjectLocal(key) {
      $window.localStorage.removeItem(KEY_PREFIX + key);
      return $q.when(key);
    };

    let getAllObjects = function getAllObjectsLocal() {
      let objects = R.pipe(
        R.keys,
        R.filter(key => key.startsWith(KEY_PREFIX)),
        R.map(key => [
          key.substr(KEY_PREFIX.length),
          getObjectSync(key.substr(KEY_PREFIX.length))
        ])
      )($window.localStorage);

      return $q.when(objects);
    };

    let storeObject = function storeObjectLocal(key, object) {
      $window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(object));
      return $q.when(object);
    };

    let storeObjectSync = function storeObjectLocalSync(key, object) {
      $window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(object));
      return object;
    };

    return {
      getObject,
      getObjectSync,
      removeObject,
      getAllObjects,
      storeObject,
      storeObjectSync
    };
  };

  let createCloud = function createCloud(moduleName = 'cloud') {
    remoteStorage.RemoteStorage
      .defineModule(STORAGE_MODULE_PREFIX + moduleName, buildModule);

    return remoteStorage.remoteStorage[STORAGE_MODULE_PREFIX + moduleName];
  };

  let createCloudUnencrypted =
    function createCloudUnencrypted(moduleName = 'cloud-unencrypted') {
      remoteStorage.RemoteStorage.defineModule(
        STORAGE_MODULE_PREFIX + moduleName,
        buildModuleUnencrypted
      );

      return remoteStorage.remoteStorage[STORAGE_MODULE_PREFIX + moduleName];
    };

  let storageService = {
    KEY_SEPARATOR,
    prepare,
    getStorageKey,
    connect,
    isConnected,
    claimAccess,
    createLocal,
    createCloud,
    createCloudUnencrypted
  };

  let initialize = function initialize() {
    enableLog();

    storageService.local = createLocal();
    storageService.cloud = createCloud();
    storageService.cloud.initialize();
    storageService.cloudUnencrypted = createCloudUnencrypted();
    storageService.cloudUnencrypted.initialize();

    claimAccess('cloud');
    claimAccess('cloud-unencrypted');
  };

  storageService.initialize = initialize;

  return storageService;
}
