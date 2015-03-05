export default function storage($log, $window, remoteStorage, cryptography) {
  let storageService = {};

  storageService.local = $window.localStorage;

  storageService.connect = remoteStorage.remoteStorage.connect;

  storageService.enableLog = remoteStorage.remoteStorage.enableLog;

  storageService.claimAccess = function claimAccess(moduleName, accessLevel) {
    remoteStorage.remoteStorage.access.claim(moduleName, accessLevel);
  };

  storageService.buildModule = function buildModule(privateClient) {
    privateClient.declareType(
      cryptography.ENCRYPTED_OBJECT.name,
      cryptography.ENCRYPTED_OBJECT.schema
    );

    let moduleFunctions = {};

    moduleFunctions.save = function save() {
      
    };

    return {
      exports: privateClient
    };
  };

  storageService.createModule = function createModule(moduleName) {
    remoteStorage.RemoteStorage
      .defineModule(moduleName, storageService.buildModule);

    return remoteStorage.remoteStorage[moduleName];
  };

  storageService.initialize = function initialize() {
    storageService.enableLog();
  };

  return storageService;
}
