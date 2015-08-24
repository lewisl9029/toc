import template from './user-card.html!text';

export let directiveName = 'tocUserCard';
export default /*@ngInject*/ function tocUserCard(
) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      message: '@'
    },
    controllerAs: 'userCard',
    controller: /*@ngInject*/ function userCardController(
      $scope,
      identity,
      R,
      state
    ) {
      this.message = $scope.message;

      let userInfoCursor = state.cloud.identity.select(['userInfo']);
      let updateUserInfo = () => {
        let userInfo = userInfoCursor.get();
        this.avatar = identity.getAvatar(userInfo);
        this.avatarText = `Avatar for ${userInfo.displayName}`;
        this.name = userInfoCursor.get(['displayName']);
      };
      state.addListener(userInfoCursor, updateUserInfo, $scope);


      if (this.message) {
        return;
      }
      let notificationsCursor = state.cloud.notifications;
      let updateSummary = () => {
        let notificationCount = R.pipe(
          R.values,
          R.reject(R.prop('dismissed'))
        )(notificationsCursor.get() || {}).length;

        if (notificationCount === 0) {
          this.summary = 'No new notifications';
          return;
        }

        this.summary = `${notificationCount} new notification${notificationCount > 1 ? 's' : ''}`;
      };
      state.addListener(notificationsCursor, updateSummary, $scope);
    }
  };
}
