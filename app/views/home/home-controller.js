export let controllerName = 'HomeController';
export default /*@ngInject*/ function HomeController(
  $ionicPopup,
  $scope,
  session,
  state,
  storage
) {
  let currentUserCursor = state.cloud.identity;
  let updateCurrentUser = () => {
    this.currentUser = currentUserCursor.get();
  };

  state.addListener(currentUserCursor, updateCurrentUser, $scope);

  //FIXME: this should probably go into state.memory if possible
  this.isStorageConnected = storage.isConnected;

  this.showSignoutConfirm = function showSignoutConfirm() {
    let signoutPopup = $ionicPopup.confirm({
      title: 'Sign Out',
      template: 'Are you sure?',
      okText: 'Sign out',
      okType: 'button-assertive button-outline',
      cancelType: 'button-calm button-outline'
    });

    signoutPopup.then((response) => {
      if (!response) {
        return;
      }

      return session.destroy();
    });
  };
}
