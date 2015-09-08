export let controllerName = 'AppController';
export default /*@ngInject*/ function AppController(
  $scope,
  state,
  R
) {
  let notificationsCursor = state.cloud.notifications;
  let updateNotificationCount = () => {
    this.notificationCount = R.pipe(
      R.values,
      R.reject(R.prop('dismissed'))
    )(notificationsCursor.get()).length;
  };

  state.addListener(notificationsCursor, updateNotificationCount, $scope);
}
