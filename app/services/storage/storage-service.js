export default function storage($window, $q, remoteStorage, cryptography, R) {
  //FIXME: storage usage is extremely high due to really long keys + storing
  // crypto settings with each item/key
  const DEFAULT_ACCESS_LEVEL = 'rw';
  const STORAGE_MODULE_PREFIX = 'toc-state-';
  const KEY_SEPARATOR = '.';


  let getStorageKey = R.join(KEY_SEPARATOR);

  let local = {};

  let connect = function connect(email) {
    return remoteStorage.remoteStorage.connect(email);
  };

  let isConnected = function isConnected() {
    return remoteStorage.remoteStorage.connected;
  };

  let enableLog = remoteStorage.remoteStorage.enableLog;

  let claimAccess =
    function claimAccess(moduleName = 'cloud', accessLevel = DEFAULT_ACCESS_LEVEL) {
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

      return $q.when(privateClient.getObject(encryptedKey))
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

      return $q.when(privateClient.getAll(key))
        .then(encryptedObjects => R.pipe(
          R.toPairs,
          R.map(encryptedKeyObjectPair => [
            cryptography.decrypt(
              JSON.parse(cryptography.unescapeBase64(encryptedKeyObjectPair[0]))
            ),
            cryptography.decrypt(encryptedKeyObjectPair[1])
          ])
        )(encryptedObjects));
    };

    let onChange = function onChange(handleChange) {
      privateClient.on('change', function handleStorageChange(event) {
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
      });
    };

    return {
      exports: {
        storeObject,
        getObject,
        removeObject,
        getAllObjects,
        onChange
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

  let createRemote = function createRemote(moduleName = 'cloud') {
    remoteStorage.RemoteStorage
      .defineModule(STORAGE_MODULE_PREFIX + moduleName, buildModule);

    return remoteStorage.remoteStorage[STORAGE_MODULE_PREFIX + moduleName];
  };

  let initialize = function initialize() {
    // enableLog();
  };

  return {
    KEY_SEPARATOR,
    getStorageKey,
    connect,
    isConnected,
    claimAccess,
    createLocal,
    createRemote,
    initialize
  };
}
