export let controllerName = 'AppController';
export default /*@ngInject*/ function AppController(
  $scope,
  $ionicPopover,
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

  this.optionsMenuPopover = $ionicPopover.fromTemplate(
    `
    <ion-popover-view>
      <toc-options-menu></toc-options-menu>
    </ion-popover-view>
    `
  );

  this.openOptionsMenuPopover = function openOptionsMenuPopover($event) {
    this.optionsMenuPopover.show($event);
  };
}
