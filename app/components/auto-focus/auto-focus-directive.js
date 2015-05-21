//workaround for transition performance issues with ionic navigation + autofocus

export default function tocAutoFocus($timeout, notification) {
  return {
    restrict: 'A',
    link: function linkAutoFocus(scope, element) {
      try {
        $timeout(() => element[0].focus(), 100);
      } catch (error) {
        notification.error(error, 'AutoFocus Error');
      }
    }
  };
}
