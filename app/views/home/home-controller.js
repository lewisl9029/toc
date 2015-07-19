export default function HomeController(state, identity, network, notification,
  $ionicPopup, $q, $window, storage, $scope) {

  let activeChannelId = state.cloud.network.get(
    ['activeChannelId']
  );

  if (activeChannelId !== 'home') {
    state.save(
      state.cloud.network,
      ['activeChannelId'],
      'home'
    );
  }

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
      okType: 'button-assertive button-outline'
    });

    signoutPopup.then((response) => {
      if (!response) {
        return;
      }

      //TODO: refactor signout into session service
      return state.remove(
          state.local.identity,
          ['savedCredentials']
        )
        .then(() => $q.when($window.location.reload()))
        .catch((error) => notification.error(error, 'Signout Error'));
    });
  };
}
