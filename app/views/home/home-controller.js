export default function HomeController(state, identity, network, notification,
  $ionicPopup, $q, $window, storage) {
  let currentUserCursor = state.cloud.identity;

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

      return state.remove(
          state.local.identity,
          ['savedCredentials']
        )
        .then(() => $q.when($window.location.reload()))
        .catch((error) => notification.error(error, 'Signout Error'));
    });
  };

  this.currentUser = currentUserCursor.get();

  currentUserCursor.on('update', () => {
    this.currentUser = currentUserCursor.get();
  });
}
