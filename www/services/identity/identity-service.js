import identityModel from 'services/identity/identity-model';

let identityService = function identity(storage) {
  let identityService = {};

  identityService.initialize = function initializeIdentity() {
    identityService.storage = storage.createModel(identityModel);
  };

  return identityService;
};

export default identityService;
