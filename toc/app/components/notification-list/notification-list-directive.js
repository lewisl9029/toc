import template from './notification-list.html!text';

export let directiveName = 'tocNotificationList';
export default /*@ngInject*/ function tocNotificationList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'notificationList',
    controller: /*@ngInject*/ function NotificationListController(
      $scope,
      identity,
      navigation,
      state,
      R
    ) {
      let notificationsCursor = state.cloud.notifications;
      let updateNotifications = () => {
        this.notifications = R.pipe(
          R.values,
          R.reject(R.prop('dismissed'))
        )(notificationsCursor.get() || {});
      };
      state.addListener(notificationsCursor, updateNotifications, $scope);
    }
  };
}
