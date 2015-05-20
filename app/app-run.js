export default function runApp($state, $rootScope, R, state, identity, contacts,
  network, notification, $q, $ionicPlatform, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default
    // Remove this to show the accessory bar above the keyboard for form inputs
    if (window.cordova && window.cordova.plugins.Keyboard) {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
  });

  state.initialize()
    .then(() => {
      let localUsers = state.persistent.cursors.identity.get();

      let rememberedUser = R.pipe(
        R.values,
        R.find((user) => user.savedCredentials)
      )(localUsers);

      if (!rememberedUser) {
        return $state.go('app.welcome');
      }

      return identity.restore(rememberedUser)
        .then(() => {
          state.save(
            state.persistent.cursors.identity,
            [rememberedUser.userInfo.id, 'latestSession'],
            Date.now()
          );

          return state.synchronized.initialize(rememberedUser.userInfo.id);
        })
        .then(() => {
          contacts.initialize()
            .catch((error) => notification.error(error, 'Contacts Error'));

          let sessionInfo = state.synchronized.cursors.network.get(
            ['sessions', rememberedUser.userInfo.id, 'sessionInfo']
          );

          network.initialize(sessionInfo.keypair)
            .catch((error) =>
              notification.error(error, 'Network Init Error'));

          let signedOutStates = [
            'app.welcome',
            'app.signin',
            'app.signup'
          ];

          if (R.any($state.includes)(signedOutStates)) {
            return $state.go('app.home');
          }

          let activeChannelId =
            state.synchronized.cursors.network.get(['activeChannelId']);

          if (activeChannelId === 'home') {
            return $state.go('app.home');
          }

          return $state.go('app.channel', {channelId: activeChannelId});
        })
        .catch((error) => notification.error(error, 'Authentication Error'));
    });


  // redirect to app.welcome if identity has not been initialized
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if (toState.name === 'app.welcome') {
      return;
    }

    if (state.synchronized.tree.get('identity')) {
      return;
    }

    $state.go('app.welcome');
  });
}
