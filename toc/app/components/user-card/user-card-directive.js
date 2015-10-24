import template from './user-card.html!text';

export let directiveName = 'tocUserCard';
export default /*@ngInject*/ function tocUserCard(
) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      message: '@',
      enableDismissNotifications: '@',
      enableProfileEdit: '@'
    },
    controllerAs: 'userCard',
    controller: /*@ngInject*/ function UserCardController(
      $scope,
      identity,
      navigation,
      R,
      state,
      session
    ) {
      this.message = $scope.message;
      this.enableDismissNotifications =
        $scope.enableDismissNotifications !== undefined;
      this.enableProfileEdit =
        $scope.enableProfileEdit !== undefined;

      session.preparePrivate().then(() => {
        let userInfoCursor = state.cloud.identity.select(['userInfo']);
        let updateUserInfo = () => {
          let userInfo = userInfoCursor.get();
          this.avatar = identity.getAvatar(userInfo);
          this.name = userInfoCursor.get(['displayName']) || 'Anonymous';
          this.avatarText = `Avatar for ${this.name}`;
        };
        state.addListener(userInfoCursor, updateUserInfo, $scope);
      });

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

        let hasMultipleNotifications = this.notificationCount > 1;
        let notificationEnding = hasMultipleNotifications ? 's' : '';

        this.message = this.notificationCount + ' new notification' +
          notificationEnding;
      };
      state.addListener(notificationsCursor, updateSummary, $scope);

      if (!this.enableDismissNotifications) {
        return;
      }

      this.handleUserCardClick = () => {
        let activeNotifications = R.pipe(
          R.values,
          R.reject(R.prop('dismissed'))
        )(notificationsCursor.get() || {});

        if (activeNotifications.length === 0 && this.enableProfileEdit) {
          let modalTemplate = `
            <toc-update-profile-modal class="toc-modal-container"
              remove-modal="userCard.updateProfileModal.remove()">
            </toc-update-profile-modal>
          `;

          let modalName = 'updateProfileModal';

          return navigation.showModal(modalName, modalTemplate, this, $scope);
        }

        return R.map((notification) => state.save(
          notificationsCursor,
          [notification.notificationInfo.id, 'dismissed'],
          true
        ))(activeNotifications);
      };
    }
  };
}
