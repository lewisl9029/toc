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
      $timeout,
      $ionicSlideBoxDelegate,
      identity,
      contacts,
      navigation,
      notifications,
      state
    ) {
      this.notificationId = $scope.notificationId;
      if (!this.notificationId) {
        return;
      }

      $timeout(() =>{
        let slideBoxDelegate =
          $ionicSlideBoxDelegate.$getByHandle(this.notificationId);


      });

      let channelId = this.notificationId;
      let channelCursor = state.cloud.channels.select([channelId]);

      let messageIdCursor = channelCursor.select(['latestMessageId']);
      let updateMessage = () => {
        if (channelCursor.get(['inviteStatus']) === 'received') {
          this.message = 'New invite received!';
          return;
        }

        let messageId = messageIdCursor.get();
        if (!messageId) {
          return;
        }
        this.message = state.cloud.messages.get([
          channelId, messageId, 'messageInfo', 'content'
        ]);
      };
      state.addListener(channelCursor, updateMessage, $scope);

      let contactId = channelCursor.get(['channelInfo', 'contactIds'])[0];
      let contactCursor = state.cloud.contacts.select(contactId);

      let contactInfoCursor = contactCursor.select(['userInfo']);
      let updateContactInfo = () => {
        let contactInfo = contactInfoCursor.get();
        this.icon = identity.getAvatar(contactInfo);
        this.iconText = `Avatar for ${contactInfo.displayName || 'Anonymous'}`;
        this.title = contactInfo.displayName || 'Anonymous';
      };
      state.addListener(contactInfoCursor, updateContactInfo, $scope);

      this.click = () => {
        if (channelCursor.get(['inviteStatus'])  === 'received') {
          return contacts.showAcceptInviteDialog(channelId);
        }

        return navigation.navigate(channelId)
          .then(() => state.save(channelCursor, ['viewingLatest'], true));
      };

      this.swipe = () => {
        return notifications.dismiss(this.notificationId);
      };
    }
  };
}
