export default function tocProgressIndicator(Mprogress, notification) {
  return {
    restrict: 'E',
    scope: {
      progressState: '@'
    },
    link: function linkProgressIndicator(scope, element, attrs) {
      try {
        let progressPromise = scope;
        let el = element[0];
      } catch (error) {
        notification.error(error, 'Progress Indicator Error');
      }
    }
  };
}
