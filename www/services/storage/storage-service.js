import contactsModel from 'services/contacts/contacts-model';

let storageService = function storage($log, remoteStorage) {
  let storageService = {};

  storageService.connect = remoteStorage.remoteStorage.connect;

  storageService.enableLog = remoteStorage.remoteStorage.enableLog;

  storageService.ACCESS_LEVELS = {
    READ: 'r',
    FULL: 'rw'
  };

  storageService.claimAccess = function claimAccess(model) {
    remoteStorage.remoteStorage.access.claim(model.name, model.accessLevel);
  };

  storageService.defineModel = function defineModel(model) {
    remoteStorage.RemoteStorage.defineModule(model.name,
      function buildModel(privateClient) {
        privateClient.declareType(model.name, model.schema);
        return {
          exports: model.defineFunctions(privateClient)
        };
      }
    );

    return remoteStorage.remoteStorage[name];
  };

  storageService.initializeModel = function initializeModel(model) {
    storageService[model.name] = storageService.defineModel(model);
    storageService.claimAcces(model);
  };

  storageService.initialize = function initialize() {
    storageService.enableLog();
    storageService.initializeModel(contactsModel);
  };

  return storageService;
};

export default storageService;
