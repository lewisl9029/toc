export default function tocSpinnerButton($timeout, notification) {
  return {
    restrict: 'A',
    scope: {
      loadingPromise: '='
    },
    link: function linkSpinnerButton(scope, element) {
      try {
        const SPIN_DURATION = 750;

        let spinnerElement = element.find('ion-spinner');
        let iconElement = element.find('i');
        let buttonElement = element;

        spinnerElement.toggleClass('toc-hidden');

        spinnerElement.toggleClass('toc-fadeout');
        iconElement.toggleClass('toc-fadein');
        let spinning = false;

        let toggleSpin = () => {
          spinning = !spinning;

          spinnerElement.toggleClass('toc-fadeout');
          iconElement.toggleClass('toc-fadeout');

          $timeout(() => {
            spinnerElement.toggleClass('toc-hidden');
            iconElement.toggleClass('toc-hidden');
            //FIXME: fadein afterwards doesnt work
            // spinnerElement.toggleClass('toc-fadein');
            // iconElement.toggleClass('toc-fadein');
          }, SPIN_DURATION);

          if (spinning) {
            buttonElement.attr('disabled', 'true');
          } else {
            buttonElement.removeAttr('disabled');
          }
        };

        scope.$watch('loadingPromise', (loadingPromise) => {
          if(!loadingPromise) {
            return;
          }
          let spinStartTime = Date.now();
          toggleSpin();

          loadingPromise.then(() => {
            let spinEndTime = Date.now();

            let spinElapsedTime =
              (spinStartTime - spinEndTime) % SPIN_DURATION;

            $timeout(() => {
              toggleSpin();
            }, SPIN_DURATION - spinElapsedTime);
          });
        });
      } catch (error) {
        notification.error(error, 'Spinner Button Error');
      }
    }
  };
}
