export default function tocAutoFocus($timeout, notification) {
  return {
    restrict: 'A',
    link: function linkAutoFocus(scope, element) {
      try {
        $timeout(() => element[0].focus(), 0);
      } catch (error) {
        notification.error(error, 'AutoFocus Error');
      }
    }
  };
}
