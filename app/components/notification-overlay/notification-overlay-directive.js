import template from './notification-overlay.html!text';

export let directiveName = 'tocNotificationOverlay';
export default /*@ngInject*/ function tocNotificationOverlay() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'notificationOverlay',
    controller: /*@ngInject*/ function NotificationOverlayController(
      $scope,
      $timeout,
      $q,
      identity,
      navigation,
      notifications,
      state,
      R
    ) {
      let notificationsCursor = state.cloud.notifications;

      let watchingNotifications = {};
      this.activeNotificationId = null;
      this.activeNotificationTimeout = null;

      let resetNotificationTimeout = (delay) => {
        if (this.activeNotificationTimeout) {
          $timeout.cancel(this.activeNotificationTimeout);
        }

        this.activeNotificationTimeout = $timeout(() => {
          this.activeNotificationId = null;
          this.activeNotificationTimeout = null;
        }, delay);
      };

      let updateActiveNotification =
        (event, notificationId) => {
          if (!notificationId) {
            if (!event.data.currentData.notificationInfo) {
              return;
            }
            notificationId = event.data.currentData.notificationInfo.id;
          }

          if (notifications.isDismissed(notificationId)) {
            resetNotificationTimeout(0);
            return;
          }
          this.activeNotificationId = notificationId;
          resetNotificationTimeout(5000);
        };

      let isFirstRun = true;
      let updateListeners = () => {
        //adds listeners for each new notificationId
        this.notifications = R.pipe(
          R.keys,
          R.reject(R.has(R.__, watchingNotifications)),
          R.forEach((notificationId) => {
            state.addListener(
              notificationsCursor.select([notificationId]),
              updateActiveNotification,
              $scope,
              { skipInitialize: true }
            );
            watchingNotifications[notificationId] = true;
            // don't fire notifications on app init
            if (isFirstRun) {
              isFirstRun = false;
              return;
            }
            updateActiveNotification(null, notificationId);
          })
        )(notificationsCursor.get() || {});
      };
      state.addListener(notificationsCursor, updateListeners, $scope);
    }
  };
}
