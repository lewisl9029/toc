import template from './message-list.html!text';

export let directiveName = 'tocMessageList';
export default /*@ngInject*/ function tocMessageList(
  $interval,
  $ionicScrollDelegate,
  navigation,
  notifications,
  R,
  state
) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      channelId: '@'
    },
    controllerAs: 'messageList',
    controller: /*@ngInject*/ function MessageListController(
      $scope,
      $state,
      identity,
      time,
      messages
    ) {
      //TODO: refactor shared functionality into messages service
      this.getAvatar = identity.getAvatar;
      this.channelId = $scope.channelId;

      let messagesCursor = state.cloud.messages.select([this.channelId]);
      let channelCursor = state.cloud.channels.select([this.channelId]);

      let userCursor = state.cloud.identity.select(['userInfo']);
      let contactCursor = state.cloud.contacts.select([
        channelCursor.get(['channelInfo', 'contactIds'])[0],
        'userInfo'
      ]);

      let updateUser = () => {
        this.userInfo = userCursor.get();
      };
      let updateContact = () => {
        this.contactInfo = contactCursor.get();
      };

      state.addListener(userCursor, updateUser, $scope);
      state.addListener(contactCursor, updateContact, $scope);

      let viewingLatestCursor = channelCursor.select(['viewingLatest']);
      let scrollToLatest = () => {
        if (!viewingLatestCursor.get()) {
          return;
        }

        if (!navigation.isActiveView(this.channelId)) {
          return;
        }

        $ionicScrollDelegate.scrollBottom(true);

        if (!notifications.isDismissed(this.channelId)) {
          notifications.dismiss(this.channelId);
        }

        if (channelCursor.get(['unreadMessageId'])) {
          state.save(channelCursor, ['unreadMessageId'], null);
        }
      };

      state.addListener(viewingLatestCursor, scrollToLatest, $scope);

      let updateMessageListPosition = () => {
        if (!navigation.isActiveView(this.channelId)) {
          return;
        }

        let scrollView = $ionicScrollDelegate.getScrollView();

        if (scrollView.__scrollTop < scrollView.__maxScrollTop) {
          return;
        }

        if (!channelCursor.get(['viewingLatest'])) {
          state.save(channelCursor, ['viewingLatest'], true);
        }

        if (channelCursor.get(['unreadMessageId'])) {
          state.save(channelCursor, ['unreadMessageId'], null);
        }
      };

      state.addListener(messagesCursor, updateMessageListPosition, $scope, {
        skipInitialize: true
      });

      $interval(() => {
        if (!navigation.isActiveView(this.channelId)) {
          return;
        }
        //Updates unread messages if scrolled to bottom
        //TODO: write a more robust version that moves unread marker granularly
        let scrollView = $ionicScrollDelegate.getScrollView();

        //Don't do anything if not at scrolled to bottom
        if (scrollView.__scrollTop < scrollView.__maxScrollTop) {
          if (!channelCursor.get(['viewingLatest'])) {
            return;
          }

          return state.save(channelCursor, ['viewingLatest'], false);
        }

        //Otherwise update pointers and dismiss notification
        if (!channelCursor.get(['viewingLatest'])) {
          state.save(channelCursor, ['viewingLatest'], true);
        }

        if (channelCursor.get(['unreadMessageId'])) {
          state.save(channelCursor, ['unreadMessageId'], null);
        }

        if (!notifications.isDismissed(this.channelId)) {
          notifications.dismiss(this.channelId);
        }
      }, 5000);

      let updateMessages = () => {
        this.messages = R.pipe(
          R.values,
          R.sort((message1, message2) => {
            let logicalClockDiff =
              message1.messageInfo.logicalClock -
              message2.messageInfo.logicalClock;

            if (logicalClockDiff === 0) {
              return message1.messageInfo.id > message2.messageInfo.id ? 1 : -1;
            }

            return logicalClockDiff;
          })
        )(messagesCursor.get());;
      };

      state.addListener(messagesCursor, updateMessages, $scope);

      this.isUnread = (message) => {
        let unreadMessageId = state.cloud.channels
          .get([this.channelId, 'unreadMessageId']);

        return unreadMessageId === message.messageInfo.id;
      };

      this.isSenderSeparator = (message) => {
        let messageIndex = this.messages.indexOf(message);
        let previousMessage = this.messages[messageIndex - 1];

        if (!previousMessage) {
          return true;
        }

        let isSenderDifferent = message.messageInfo.senderId !==
          previousMessage.messageInfo.senderId;

        return isSenderDifferent;
      };

      this.isMinuteSeparator = (message) => {
        let messageIndex = this.messages.indexOf(message);
        let previousMessage = this.messages[messageIndex - 1];

        if (!previousMessage) {
          return true;
        }

        return time.isMinuteDifferent(
          message.messageInfo.sentTime,
          previousMessage.messageInfo.sentTime
        );
      };

      this.isDateSeparator = (message) => {
        let messageIndex = this.messages.indexOf(message);
        let previousMessage = this.messages[messageIndex - 1];

        if (!previousMessage) {
          return true;
        }

        if (this.isUnread(message)) {
          return false;
        }

        return time.isDayDifferent(
          message.messageInfo.sentTime,
          previousMessage.messageInfo.sentTime
        );
      };

      this.getUserInfo = (message) => {
        if (!message) {
          return;
        }

        let senderId = message.messageInfo.senderId;

        if (this.userInfo.id === senderId) {
          return this.userInfo;
        }
        //FIXME: this wont work for group chats
        return this.contactInfo;
      };

      this.getAvatar = (message) => {
        if (!message) {
          return;
        }

        return identity.getAvatar(this.getUserInfo(message));
      };

      this.getTimestamp = (message) => {
        return time.getTimestamp(message.messageInfo.sentTime);
      };

      this.getDatestamp = (message) => {
        return time.getDatestamp(message.messageInfo.sentTime);
      };
    }
  };
}
