export default /*@ngInject*/ function runApp(
  $ionicPlatform,
  navigation,
  session,
  state,
  storage
) {
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

    navigation.setupRedirect();

    storage.prepare()
      .then(() => state.initialize())
      .then(() => session.restore());
  });
}
