let service = function storage($log, remoteStorage) {
  let storageService = {};

  storageService.store = remoteStorage.remoteStorage;

  storageService.defineModule = function defineModule(moduleName, buildModule) {
    remoteStorage.RemoteStorage.defineModule(moduleName, buildModule);
    return storageService;
  };

  return storageService;
};

export default service;
