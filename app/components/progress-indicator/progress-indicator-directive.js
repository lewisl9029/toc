export default function tocProgressIndicator(Mprogress, notification) {
  return {
    restrict: 'A',
    scope: {
      inProgress: '@',
      elementId: '@',
      progressType: '@'
    },
    link: function linkProgressIndicator(scope, element, attr) {
      try {
        let elementId = scope.elementId;
        if (!elementId) {
          throw new Error('Element needs an unique id');
        }

        let PROGRESS_TYPES = {
          determinate: 1,
          buffer: 2,
          indeterminate: 3,
          query: 4,
        };

        let progressIndicator = new Mprogress({
          template: PROGRESS_TYPES[scope.progressType] || 4,
          parent: '#' + elementId
        });

        let progressStartTime;
        var QUERY_ANIMATION_TIME = 2800;

        attr.$observe('inProgress', (newValue) => {
          if (newValue === '') {
            return;
          }

          if (newValue === 'true') {
            progressStartTime = Date.now();
            progressIndicator.start();
            return;
          }

          if (newValue === 'false') {
            if (scope.progressType !== 'query') {
              progressIndicator.end();
              return;
            }

            let progressEndTime = Date.now();
            let queryElapsedTime =
              (progressEndTime - progressStartTime) % QUERY_ANIMATION_TIME;

            setTimeout(() => {
              progressIndicator.end();
            }, QUERY_ANIMATION_TIME - queryElapsedTime);
          }
        });
      } catch (error) {
        notification.error(error, 'Progress Indicator Error');
      }
    }
  };
}
