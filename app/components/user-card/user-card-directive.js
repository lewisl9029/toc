import template from './user-card.html!text';

export let directiveName = 'tocUserCard';
export default /*@ngInject*/ function tocUserCard(
) {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'userCard',
    controller: /*@ngInject*/ function userCardController(
      $scope,
      identity,
      R,
      state
    ) {
      let userCursor = state.cloud.identity.select(['userInfo']);

      let nameCursor = userCursor.select(['displayName']);
      let updateName = () => {
        this.name = nameCursor.get();
      };
      state.addListener(nameCursor, updateName, $scope);

      let emailCursor = userCursor.select(['email']);
      let updateAvatar = () => {
        let email = emailCursor.get();
        this.avatar = identity.getAvatar(email);
        this.avatarText = `Avatar for ${email}`;
      };
      state.addListener(emailCursor, updateAvatar, $scope);

      let notificationsCursor = state.cloud.notifications;
      let updateSummary = () => {
        let notificationCount = R.keys(notificationsCursor.get()).length;

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
