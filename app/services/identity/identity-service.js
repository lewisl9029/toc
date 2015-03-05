export default function identity(state) {
  let identityService = {};

  identityService.initialize = function initializeIdentity() {

  };

  identityService.createNewIdentity = function createNewIdentity(userInfo) {
    state.save('identity', {
      id: '1234',
      displayName: userInfo.displayName,
      email: userInfo.email
    }).then(() => console.dir(state.cache));
  };

  return identityService;
}
