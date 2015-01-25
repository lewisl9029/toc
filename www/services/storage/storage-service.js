import contactsModel from 'services/contacts/contacts-model';

let storageService = function storage($log, $window, remoteStorage) {
  let storageService = {};

  storageService.local = $window.localStorage;

  storageService.connect = remoteStorage.remoteStorage.connect;

  storageService.enableLog = remoteStorage.remoteStorage.enableLog;

  storageService.claimAccess = function claimAccess(model) {
    remoteStorage.remoteStorage.access.claim(model.name, model.accessLevel);
  };

  storageService.defineModel = function defineModel(model) {
    remoteStorage.RemoteStorage.defineModule(model.name, model.builder);

    return remoteStorage.remoteStorage[name];
  };

  storageService.initializeModel = function initializeModel(model) {
    storageService[model.name] = storageService.defineModel(model);
    storageService.claimAccess(model);
  };

  storageService.initialize = function initialize() {
    storageService.enableLog();
    storageService.initializeModel(contactsModel);
  };

  return storageService;
};

export default storageService;
