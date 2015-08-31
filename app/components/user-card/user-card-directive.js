import template from './user-card.html!text';

export let directiveName = 'tocUserCard';
export default /*@ngInject*/ function tocUserCard(
) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      message: '@',
      enableDismissNotifications: '@'
    },
    controllerAs: 'userCard',
    controller: /*@ngInject*/ function UserCardController(
      $scope,
      identity,
      R,
      state
    ) {
      this.message = $scope.message;
      this.enableDismissNotifications =
        $scope.enableDismissNotifications !== undefined;

      let userInfoCursor = state.cloud.identity.select(['userInfo']);
      let updateUserInfo = () => {
        let userInfo = userInfoCursor.get();
        this.avatar = identity.getAvatar(userInfo);
        this.avatarText = `Avatar for ${userInfo.displayName || 'Anonymous'}`;
        this.name = userInfoCursor.get(['displayName']) || 'Anonymous';
      };
      state.addListener(userInfoCursor, updateUserInfo, $scope);

      if (this.message) {
        return;
      }

      let notificationsCursor = state.cloud.notifications;
      let updateSummary = () => {
        this.notificationCount = R.pipe(
          R.values,
          R.reject(R.prop('dismissed'))
        )(notificationsCursor.get() || {}).length;

        if (this.notificationCount === 0) {
          this.message = 'No new notifications';
          return;
        }

        if (this.enableDismissNotifications) {
          this.message = 'Dismiss all notifications';
          return;
        }

        this.message = this.notificationCount + ' new notification' +
          this.notificationCount > 1 ? 's' : '';
      };
      state.addListener(notificationsCursor, updateSummary, $scope);

      if (!this.enableDismissNotifications) {
        return;
      }

      this.dismissNotifications = () => {
        R.pipe(
          R.values,
          R.reject(R.prop('dismissed')),
          R.forEach((notification) => {
            state.save(
              notificationsCursor,
              [notification.notificationInfo.id, 'dismissed'],
              true
            );
          })
        )(notificationsCursor.get());
      };
    }
  };
}
