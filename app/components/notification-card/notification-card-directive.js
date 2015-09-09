import template from './notification-card.html!text';

export let directiveName = 'tocNotificationCard';
export default /*@ngInject*/ function tocNotificationCard() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      notificationId: '@'
    },
    controllerAs: 'notificationCard',
    controller: /*@ngInject*/ function NotificationCardController(
      $scope,
      $ionicPopup,
      identity,
      contacts,
      navigation,
      state
    ) {
      //TODO: reduce volume of update events in other services
      // by limiting scope of listening cursors as done here
      this.notificationId = $scope.notificationId;
      let notificationInfoCursor = state.cloud.notifications.get([
        this.notificationId, 'notificationInfo'
      ]);
      let updateNotificationInfo = () => {
        let notificationInfo = notificationInfoCursor.get();
        this.title = notificationInfo.title;
        this.message = notificationInfo.message;
        this.icon = notificationInfo.icon;
        this.iconText = notificationInfo.iconText;
      };
      state.addListener(notificationInfoCursor, updateNotificationInfo, $scope);

      this.click = () => {
        if (channelCursor.get(['inviteStatus'])  === 'received') {
          return contacts.showAcceptInviteDialog(channelId);
        }

        return navigation.navigate(channelId)
          .then(() => state.save(channelCursor, ['viewingLatest'], true));
      };
    }
  };
}
