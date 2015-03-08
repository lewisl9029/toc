export default function storage($log, $window, remoteStorage, cryptography) {
  const DEFAULT_ACCESS_LEVEL = 'rw';

  let local = $window.localStorage;

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

    //TODO: implement path obfuscation
    moduleFunctions.storeObject = function storeObject(path, object) {
      let encryptedObject = cryptography.encrypt(object);

      return privateClient.storeObject(
        cryptography.ENCRYPTED_OBJECT.name,
        path,
        encryptedObject
      );
    };

    moduleFunctions.getObject = function getObject(path) {
      return privateClient.getObject(path)
        .then(cryptography.decrypt);
    };

    moduleFunctions.onChange = function onChange(handleChange) {
      privateClient.on('change', function handleStorageChange(event) {
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
    enableLog();
  };

  return {
    local,
    claimAccess,
    createModule,
    initialize
  };
}
