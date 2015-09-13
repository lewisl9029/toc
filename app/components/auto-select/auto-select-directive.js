export let directiveName = 'tocAutoSelect';
export default /*@ngInject*/ function tocAutoSelect(
  $window,
  $log,
  notifications,
  devices
) {
  return {
    restrict: 'A',
    link: function linkAutoSelect(scope, element) {
      // Auto select interferes with tap-hold selection
      // and doesn't bring up copy dialog on cordova android
      // only enable autoselect if clipboard API is supported
      let clipboardSupported = $window.document.queryCommandSupported("copy");
      if (devices.isCordovaApp() && !clipboardSupported) {
        return;
      }

      element.bind('click', function(event) {
        event.preventDefault();
        element[0].select();

        try {
          $window.document.execCommand('copy');
          notifications.notifySystem('Copied to clipboard!');
        } catch (error) {
          $log.error(error);
        }
      });
    }
  };
}
