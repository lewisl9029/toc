export default function runApp($state, $rootScope, R, state, identity, contacts,
  network, notification, $q, $ionicPlatform, $location, $ionicHistory, $timeout,
  navigation) {
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

  // redirect to app.welcome if identity has not been initialized
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    let doRedirect = navigation.isPrivateState(toState.name);
    let redirectStateName = 'app.welcome';

    if (state.cloud.cursors && state.cloud.cursors.identity.get()) {
      doRedirect = !doRedirect;
      redirectStateName = 'app.home';
    }

    if (!doRedirect) {
      return;
    }

    event.preventDefault();
    return $state.go(redirectStateName);
  });

  state.initialize()
    .then(() => {
      let localUsers = state.local.tree.get();

      let rememberedIdUserPair;

      if (R.keys(localUsers).length !== 0) {
        rememberedIdUserPair = R.pipe(
          R.toPairs,
          R.map((idUserPair) => [
            idUserPair[0],
            R.prop('identity')(idUserPair[1])
          ]),
          R.find((idUserPair) => idUserPair[1].savedCredentials)
        )(localUsers);
      }

      if (!rememberedIdUserPair) {
        if (!$state.is('app.welcome')) {
          $ionicHistory.nextViewOptions({
            historyRoot: true,
            disableBack: true,
            disableAnimate: true
          });
        }

        return $state.go('app.welcome')
          //workaround for too early initialization
          .then(() => $timeout(() => $ionicHistory.clearCache(), 0));
      }

      let rememberedUser = state.cloudUnencrypted.tree.get([
        rememberedIdUserPair[0],
        'identity'
      ]);

      rememberedUser.savedCredentials =
        rememberedIdUserPair[1].savedCredentials;

      return identity.initialize(rememberedUser.userInfo.id)
        .then(() => identity.restore(rememberedUser))
        .then(() => {
          state.save(
            state.cloudUnencrypted.cursors.identity,
            ['latestSession'],
            Date.now()
          );

          return state.cloud.initialize(rememberedUser.userInfo.id);
        })
        .then(() => {
          contacts.initialize()
            .catch((error) => notification.error(error, 'Contacts Error'));

          let sessionInfo = state.cloud.cursors.network.get(
            ['sessions', rememberedUser.userInfo.id, 'sessionInfo']
          );

          network.initialize(sessionInfo.keypair)
            .then(() => network.initializeChannels())
            .catch((error) =>
              notification.error(error, 'Network Init Error'));

          if (!navigation.isPrivateState()) {
            if (!$state.is('app.home')) {
              $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableBack: true,
                disableAnimate: true
              });
            }

            return $state.go('app.home');
          }

          let activeChannelId =
            state.cloud.cursors.network.get(['activeChannelId']);

          if (activeChannelId === 'home') {
            if (!$state.is('app.home')) {
              $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableBack: true,
                disableAnimate: true
              });
            }

            return $state.go('app.home');
          }

          if (!$state.includes('app.channel')) {
            $ionicHistory.nextViewOptions({
              historyRoot: true,
              disableBack: true,
              disableAnimate: true
            });
          }

          return $state.go('app.channel', {channelId: activeChannelId});
        })
        .catch((error) => {
          return notification.error(error, 'Authentication Error')
            .then(() => identity.destroy());
        });
    });
}
