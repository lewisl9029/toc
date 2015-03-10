export default function storage(R, $window, remoteStorage, cryptography) {
  const DEFAULT_ACCESS_LEVEL = 'rw';

  let local = {
    getObject: function getObjectLocal(path) {
      return JSON.parse($window.localStorage.getItem(path));
    },
    storeObject: function storeObjectLocal(path, object) {
      return $window.localStorage.setItem(path, JSON.stringify(object));
    }
  };

  // let connect = remoteStorage.remoteStorage.connect;

  let enableLog = remoteStorage.remoteStorage.enableLog;

  let claimAccess =
    function claimAccess(moduleName, accessLevel = DEFAULT_ACCESS_LEVEL) {
      remoteStorage.remoteStorage.access.claim(moduleName, accessLevel);
    };

  let buildModule = function buildModule(privateClient) {
    privateClient.declareType(
      cryptography.ENCRYPTED_OBJECT.name,
      cryptography.ENCRYPTED_OBJECT.schema
    );

    let moduleFunctions = {};

    moduleFunctions.storeObject = function storeObject(path, object) {
      let encryptedObject = cryptography.encrypt(object);
      let encryptedPath = cryptography.encryptDeterministic(path).ct;

      return privateClient.storeObject(
        cryptography.ENCRYPTED_OBJECT.name,
        encryptedPath,
        encryptedObject
      );
    };

    moduleFunctions.getObject = function getObject(path) {
      let encryptedPath = cryptography.encryptDeterministic(path).ct;

      return privateClient.getObject(encryptedPath)
        .then(cryptography.decrypt);
    };

    moduleFunctions.getAllObjects = function getAllObjects() {
      //all encrypted paths are under root
      let path = '';

      return privateClient.getAll(path)
        .then(encryptedObjects => R.pipe(
          R.toPairs,
          R.map(encryptedPathObjectPair => [
            cryptography.decrypt({ct: encryptedPathObjectPair[0]}),
            cryptography.decrypt(encryptedPathObjectPair[1])
          ])
        )(encryptedObjects));
    };

    moduleFunctions.onChange = function onChange(handleChange) {
      privateClient.on('change', function handleStorageChange(event) {
        //
        let decryptedEvent = event;
        decryptedEvent.newValue = event.newValue ?
          cryptography.decrypt(event.newValue) :
          event.newValue;
        decryptedEvent.oldValue = event.oldValue ?
          cryptography.decrypt(event.oldValue) :
          event.oldValue;
        handleChange(event);
      });
    };

    return {
      exports: moduleFunctions
    };
  };

  let createModule = function createModule(moduleName) {
    remoteStorage.RemoteStorage.defineModule(moduleName, buildModule);

    return remoteStorage.remoteStorage[moduleName];
  };

  let initialize = function initialize() {
    // enableLog();
  };

  return {
    local,
    claimAccess,
    createModule,
    initialize
  };
}
