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
        this.notifications = notificationsCursor.get();
      };
      state.addListener(notificationsCursor, updateNotifications, $scope);

      this.isActive = (notification) => {
        return R.keys(notification).length !== 0;
      };

      this.handleClick = (notificationId) => {
        return navigation.goFromMenu(notificationId);
      };
    }
  };
}
