export default function HomeController(state, session, identity, network,
  notification, $ionicPopup, $q, $window, storage, $scope) {

  //TODO: do this in a $stateChangeStart hook instead
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

      return session.signOut();
    });
  };
}
