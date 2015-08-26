export let directiveName = 'tocAutoSelect';
export default /*@ngInject*/ function tocAutoSelect(
  devices
) {
  return {
    restrict: 'A',
    link: function linkAutoSelect(scope, element) {
      // Auto select interferes with tap-hold selection
      // and doesn't bring up copy dialog on cordova android
      if (devices.isCordovaApp()) {
        return;
      }

      element.bind('click', function() {
        element[0].select();
      });
    }
  };
}
