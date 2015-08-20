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
      state
    ) {
    }
  };
}
