export default /*@ngInject*/ function runApp(
  $ionicPlatform,
  $window,
  session
) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default
    // Remove this to show the accessory bar above the keyboard for form inputs
    if ($window.cordova && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if ($window.StatusBar) {
      // org.apache.cordova.statusbar required
      $window.StatusBar.styleDefault();
    }
    if ($window.cordova && $window.cordova.plugins.backgroundMode) {
      // enables background operation
      // de.appplant.cordova.plugin.background-mode required
      // $window.cordova.plugins.backgroundMode.setDefaults({ silent: true });
      $window.cordova.plugins.backgroundMode.setDefaults({
        title: 'Toc Messenger',
        ticker: 'Toc Messenger is running in background',
        text: 'Online'
      });

      $window.cordova.plugins.backgroundMode.enable();
    }
    if ($window.cordova && $window.cordova.plugins.autoStart) {
      // enables startup on boot
      // com.tonikorin.cordova.plugin.autostart required
      $window.cordova.plugins.autoStart.enable();
    }

    session.initialize();
  });
}
