import identityModel from 'services/identity/identity-model';

export default function identity(state, storage) {
  let identityService = {};

  identityService.initialize = function initializeIdentity() {
    identityService.storage = storage.createModel(identityModel);
  };

  identityService.createNewIdentity = function createNewIdentity(userInfo) {
    state.users[1] = userInfo;
  };

  return identityService;
}
