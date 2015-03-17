export default function runApp($state, $rootScope, state, $ionicPlatform) {
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

  state.initialize();
  // go to welcome on startup, temporary measure until remember-me implemented
  $state.go('app.welcome');
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
