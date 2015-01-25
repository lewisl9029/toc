let storageService = function storage($log, $window, remoteStorage) {
  let storageService = {};

  storageService.local = $window.localStorage;

  storageService.connect = remoteStorage.remoteStorage.connect;

  storageService.enableLog = remoteStorage.remoteStorage.enableLog;

  storageService.claimAccess = function claimAccess(model) {
    remoteStorage.remoteStorage.access.claim(model.name, model.accessLevel);
  };

  storageService.createModel = function defineModel(model) {
    remoteStorage.RemoteStorage.defineModule(model.name, model.builder);
    storageService.claimAccess(model);

    return remoteStorage.remoteStorage[model.name];
  };

  storageService.initialize = function initialize() {
    storageService.enableLog();
  };

  return storageService;
};

export default storageService;
