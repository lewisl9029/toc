let service = function storage($log, remoteStorage) {
  let storageService = {};

  storageService = new remoteStorage.RemoteStorage();

  // storageService.access = remoteStorage.remoteStorage.access;
  //
  // storageService.displayWidget = remoteStorage.remoteStorage.displayWidget;
  //
  // storageService.defineModule = function defineModule(moduleName, buildModule) {
  //   remoteStorage.RemoteStorage.defineModule(moduleName, buildModule);
  //   return storageService;
  // };

  return storageService;
};

export default service;
