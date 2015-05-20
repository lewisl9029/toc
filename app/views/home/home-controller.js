export default function HomeController(state, identity, network, notification,
  $ionicPopup, $q) {
  let currentUserCursor = state.synchronized.cursors.identity;

  let activeChannelId = state.synchronized.cursors.network.get(
    ['activeChannelId']
  );

  if (activeChannelId !== 'home') {
    state.save(
      state.synchronized.cursors.network,
      ['activeChannelId'],
      'home'
    );
  }

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
          state.persistent.cursors.identity,
          [currentUserCursor.get(['userInfo', 'id']), 'savedCredentials']
        )
        .then(() => $q.when(window.location.reload()))
        .catch((error) => notification.error(error, 'Signout Error'));
    });
  };

  this.currentUser = currentUserCursor.get();

  currentUserCursor.on('update', () => {
    this.currentUser = currentUserCursor.get();
  });
}
