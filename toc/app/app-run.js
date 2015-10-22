export default /*@ngInject*/ function runApp(
  $ionicPlatform,
  session
) {
  $ionicPlatform.ready(function() {
    session.initialize();
  });
}
