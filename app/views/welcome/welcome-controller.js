export let controllerName = 'WelcomeController';
export default /*@ngInject*/ function WelcomeController(
  $ionicPopup,
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

  this.showResetConfirm = function showResetConfirm() {
    let resetPopup = $ionicPopup.confirm({
      title: 'Reset App State',
      template: 'Are you sure?',
      okText: 'Reset',
      okType: 'button-assertive button-outline'
    });

    resetPopup.then((response) => {
      if (!response) {
        return;
      }

      return state.destroy();
    });
  };
}
