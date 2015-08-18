import template from './notification-card.html!text';

export let directiveName = 'tocNotificationCard';
export default /*@ngInject*/ function tocNotificationCard() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      notificationType: '@',
      notificationId: '@'
    },
    controllerAs: 'notificationCard',
    controller: /*@ngInject*/ function NotificationCardController(
      $scope,
      identity,
      state
    ) {
      //TODO: reduce volume of update events in other services
      // by limiting scope of listening cursors as done here
      this.notificationType = $scope.notificationType;
      this.notificationId = $scope.notificationId;

      let channelCursor = state.cloud.channels.select([this.notificationId]);

      let messageIdCursor = channelCursor.select(['unreadMessageId']);
      let updateMessage = () => {
        let messageId = messageIdCursor.get();
        if (!messageId) {
          return;
        }
        this.message = state.cloud.messages.get([
          this.notificationId, messageId, 'messageInfo', 'content'
        ]);
      };
      state.addListener(messageIdCursor, updateMessage, $scope);

      let contactId = channelCursor.get(['channelInfo', 'contactIds'])[0];
      let contactCursor = state.cloud.contacts.select(contactId);

      let emailCursor = contactCursor.select(['userInfo', 'email']);
      let updateIcon = () => {
        this.icon = identity.getAvatar(emailCursor.get());
      };
      state.addListener(emailCursor, updateIcon, $scope);

      let nameCursor = contactCursor.select(['userInfo', 'displayName']);
      let updateTitle = () => {
        this.title = nameCursor.get();
      };
      state.addListener(nameCursor, updateTitle, $scope);
    }
  };
}
