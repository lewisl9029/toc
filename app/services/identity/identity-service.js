import identityModel from 'services/identity/identity-model';

export default function identity(state, storage) {
  let identityService = {};

  identityService.initialize = function initializeIdentity() {
    state.current.
  };

  identityService.createNewIdentity = function createNewIdentity(userInfo) {
    state.current.storeObject('string', 'id', 1);
    state.identity.storeObject('string', 'displayName', userInfo.displayName);
    state.identity.storeObject('string', 'email', userInfo.email);
  };

  return identityService;
}
