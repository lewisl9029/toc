export default function storage($log, $window, remoteStorage, cryptography) {
  let storageService = {};

  const DEFAULT_ACCESS_LEVEL = 'rw';

  // let local = $window.localStorage;
  //
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
        decryptedEvent.newValue = cryptography.decrypt(event.newValue);
        decryptedEvent.newValue = cryptography.decrypt(event.newValue);
      });
    };

    return {
      exports: moduleFunctions
    };
  };

  let createModule = function createModule(moduleName) {
    remoteStorage.RemoteStorage.defineModule(moduleName, buildModule);

    return remoteStorage.remoteStorage[moduleName];
  }

  let initialize = function initialize() {
    storageService.enableLog();
  };

  storageService.claimAccess = claimAccess;
  storageService.buildModule = buildModule;
  storageService.createModule = createModule;
  storageService.enableLog = enableLog;
  storageService.initialize = initialize;

  return storageService;
}
