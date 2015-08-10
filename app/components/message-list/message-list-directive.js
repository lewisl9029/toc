import template from './message-list.html!text';

export let directiveName = 'tocMessageList';
export default /*@ngInject*/ function tocMessageList(
  $interval,
  $ionicScrollDelegate,
  R,
  state
) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      channelId: '@'
    },
    link: function linkMessageList(scope) {
      let channelCursor = state.cloud.channels
        .select([scope.channelId]);
      let messagesCursor = state.cloud.messages
        .select([scope.channelId]);

      $ionicScrollDelegate.scrollBottom(false);

      let updateMessageListPosition = () => {
        let scrollView = $ionicScrollDelegate.getScrollView();

        if (scrollView.__scrollTop !== scrollView.__maxScrollTop) {
          return;
        }

        $ionicScrollDelegate.scrollBottom(true);

        state.save(
          channelCursor,
          ['unreadMessageId'],
          null
        );
      };

      state.addListener(messagesCursor, updateMessageListPosition, scope, {
        skipInitialize: true
      });

      $interval(() => {
        //Updates unread messages based on scroll position
        let scrollView = $ionicScrollDelegate.getScrollView();

        //Don't do anything if not at scrolled to bottom
        if (scrollView.__scrollTop !== scrollView.__maxScrollTop) {
          if (!channelCursor.get(['viewingLatest'])) {
            return;
          }

          return state.save(
            channelCursor,
            ['viewingLatest'],
            false
          );
        }

        //Otherwise update unread pointer
        if (!channelCursor.get(['viewingLatest'])) {
          state.save(
            channelCursor,
            ['viewingLatest'],
            true
          );
        }

        if (channelCursor.get(['unreadMessageId'])) {
          state.save(
            channelCursor,
            ['unreadMessageId'],
            null
          );
        }
      }, 3000);
    },
    controllerAs: 'messageList',
    controller: /*@ngInject*/ function MessageListController(
      $scope,
      $state,
      identity,
      time
    ) {
      this.getAvatar = identity.getAvatar;
      this.channelId = $scope.channelId;

      let messagesCursor = state.cloud.messages.select([this.channelId]);

      let updateMessages = () => {
        this.messages = R.values(messagesCursor.get());
      };

      state.addListener(messagesCursor, updateMessages, $scope);

      this.isUnread = (message) => {
        let unreadMessageId = state.cloud.channels
          .get([this.channelId, 'unreadMessageId']);

        return unreadMessageId === message.messageInfo.id;
      };

      //TODO: memoize part of this and refactor into message service
      this.isMessageSeparator = (message) => {
        let messageIndex = this.messages.indexOf(message);
        let previousMessage = this.messages[messageIndex - 1];

        if (!previousMessage) {
          return true;
        }

        if (this.isUnread(message)) {
          return true;
        }

        let isSenderDifferent = message.messageInfo.senderId !==
          previousMessage.messageInfo.senderId;

        if (isSenderDifferent) {
          return true;
        }

        let isMinuteDifferent = time.isMinuteDifferent(
          message.messageInfo.sentTime,
          previousMessage.messageInfo.sentTime
        );

        return isMinuteDifferent;
      };

      this.getUserInfo = (message) => {
        if (!message) {
          return;
        }

        let senderId = message.messageInfo.senderId;
        let userInfo = state.cloud.identity.get().userInfo;

        if (userInfo.id === senderId) {
          return userInfo;
        }

        let contactInfo = state.cloud.contacts.get(senderId).userInfo;

        return contactInfo;
      };

      this.getAvatar = (message) => {
        if (!message) {
          return;
        }

        return identity.getAvatar(this.getUserInfo(message).email);
      };

      this.getTimestamp = (message) => {
        return time.getTimestamp(message.messageInfo.sentTime);
      };
    }
  };
}
