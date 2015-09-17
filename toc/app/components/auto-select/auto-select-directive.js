export let directiveName = 'tocAutoSelect';
export default /*@ngInject*/ function tocAutoSelect(
  $window,
  $log,
  notifications,
  devices
) {
  return {
    restrict: 'A',
    scope: {
      notifyCopied: '@'
    },
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
        if (element[0].select) {
          element[0].select();
        }
        else {
          if ($window.getSelection) {
            let selection = $window.getSelection();
            let range = $window.document.createRange();
            range.selectNodeContents(element[0]);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }

        try {
          $window.document.execCommand('copy');
          if (scope.notifyCopied) {
            notifications.notifySystem('Copied to clipboard!');
          }
          if (element[0].select) {
            element[0].blur();
          }
          else {
            if ($window.getSelection) {
              let selection = $window.getSelection();
              selection.removeAllRanges();
            }
          }
        } catch (error) {
          // don't clear selection as fallback to allow users to copy manually
          $log.error(error);
        }
      });
    }
  };
}
