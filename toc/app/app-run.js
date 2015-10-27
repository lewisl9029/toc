export default /*@ngInject*/ function runApp(
  $ionicPlatform,
  $window,
  session
) {
  $ionicPlatform.ready(function() {
    if ($window.cordova && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      $window.cordova.plugins.Keyboard.disableScroll(true);
    }

    if ($window.cordova && $window.StatusBar) {
      $window.StatusBar.styleLightContent();
    }

    session.initialize();
  });
}
