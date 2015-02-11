import identityModel from 'services/identity/identity-model';

export default function identity(storage) {
  let identityService = {};

  identityService.initialize = function initializeIdentity() {
    identityService.storage = storage.createModel(identityModel);
  };

  return identityService;
}
