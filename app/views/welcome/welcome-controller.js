export let controllerName = 'WelcomeController';
export default /*@ngInject*/ function WelcomeController(
  $scope,
  R,
  state,
  storage
) {
  this.isStorageConnected = storage.isConnected;

  let savedUsersCursor = state.cloudUnencrypted.cursor;
  let updateSavedUsers = () => {
    this.users = R.keys(savedUsersCursor.get()).length;
  };

  state.addListener(savedUsersCursor, updateSavedUsers, $scope);
}
