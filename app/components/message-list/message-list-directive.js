import template from './message-list.html!text';

export let directiveName = 'tocMessageList';
export default /*@ngInject*/ function tocMessageList(
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
      // let messagesCursor = state.cloud.messages
      //   .select([scope.channelId]);
      //
      // $ionicScrollDelegate.scrollBottom(false);
      //
      // let updateMessageListPosition = () => {
      //   let scrollView = $ionicScrollDelegate.getScrollView();
      //
      //   if (scrollView.__scrollTop !== scrollView.__maxScrollTop) {
      //     return;
      //   }
      //
      //   $ionicScrollDelegate.scrollBottom(true);
      //
      //   let messages = messagesCursor.get();
      //
      //   R.pipe(
      //     R.values,
      //     //FIXME: figure out why R.not doesnt work here
      //     // R.filter(R.pipe(R.prop('isRead'), R.not),
      //     R.filter(R.pipe(R.prop('isRead'), (bool) => !bool)),
      //     R.forEach((message) => state.save(
      //       messagesCursor,
      //       [message.messageInfo.id, 'isRead'],
      //       true
      //     ))
      //   )(messages);
      // };
      //
      // state.addListener(messagesCursor, updateMessageListPosition, scope, {
      //   skipInitialize: true
      // });
    },
    controllerAs: 'messageList',
    controller: /*@ngInject*/ function MessageListController(
      $interval,
      $scope,
      $state,
      identity
    ) {
      this.getAvatar = identity.getAvatar;
      this.channelId = $scope.channelId;

      let messagesCursor = state.cloud.messages.select([this.channelId]);

      let updateMessages = () => {
        this.messages = R.values(messagesCursor.get());
      };

      state.addListener(messagesCursor, updateMessages, $scope);

      //
      // let channelCursor = state.cloud.channels.select([this.channelId]);
      //
      // let updateChannel = () => {
      //   this.channel = channelCursor.get();
      // };
      //
      // state.addListener(channelCursor, updateChannel, $scope);
      //
      // let contactsCursor = state.cloud.contacts;
      // let updateContacts = () => {
      //   this.contacts = contactsCursor.get();
      // };
      //
      // state.addListener(contactsCursor, updateContacts, $scope);
      //
      // let identityCursor = state.cloud.identity;
      // let updateUserInfo = () => {
      //   this.userInfo = identityCursor.get(['userInfo']);
      // };
      //
      // state.addListener(identityCursor, updateUserInfo, $scope);



    //   let getMessageList = function getMessageList(messages) {
    //     return R.pipe(
    //       R.values,
    //       R.sort((message1, message2) => {
    //         if (message1.messageInfo.logicalClock ===
    //           message2.messageInfo.logicalClock) {
    //           return message1.messageInfo.id > message2.messageInfo.id ?
    //             1 : -1;
    //         }
    //
    //         return message1.messageInfo.logicalClock >
    //           message2.messageInfo.logicalClock ?
    //           1 : -1;
    //       }),
    //       R.reduce((groupedMessages, message) => {
    //         let messageVm = message.messageInfo;
    //         messageVm.isRead = message.isRead;
    //
    //         if (groupedMessages.length === 0) {
    //           groupedMessages.push([messageVm]);
    //           return groupedMessages;
    //         }
    //
    //         let latestGroup = groupedMessages[groupedMessages.length - 1];
    //
    //         if (latestGroup[0].sender === messageVm.sender) {
    //           latestGroup.push(messageVm);
    //         } else {
    //           groupedMessages.push([messageVm]);
    //         }
    //
    //         return groupedMessages;
    //       }, [])
    //     )(messages);
    //   };
    //
    //   let messagesCursor = state.cloud.messages
    //     .select([$scope.channelId]);
    //   let updateGroupedMessages = () => {
    //     this.groupedMessages = getMessageList(messagesCursor.get());
    //   };
    //
    //   state.addListener(messagesCursor, updateGroupedMessages, $scope);
    //
    //   $interval(() => {
    //     //Updates unread messages based on scroll position
    //     //TODO: write a more performant version of this
    //     let scrollView = $ionicScrollDelegate.getScrollView();
    //
    //     if (scrollView.__scrollTop !== scrollView.__maxScrollTop) {
    //       if (!channelsCursor.get([$scope.channelId, 'viewingLatest'])) {
    //         return;
    //       }
    //
    //       return state.save(
    //         channelsCursor,
    //         [$scope.channelId, 'viewingLatest'],
    //         false
    //       );
    //     }
    //
    //     let messages = messagesCursor.get();
    //
    //     R.pipe(
    //       R.values,
    //       //FIXME: figure out why R.not doesnt work here
    //       // R.filter(R.pipe(R.prop('isRead'), R.not),
    //       R.filter(R.pipe(R.prop('isRead'), (bool) => !bool)),
    //       R.forEach((message) => state.save(
    //         messagesCursor,
    //         [message.messageInfo.id, 'isRead'],
    //         true
    //       ))
    //     )(messages);
    //
    //     if (channelsCursor.get([$scope.channelId, 'viewingLatest'])) {
    //       return;
    //     }
    //     state.save(channelsCursor, [$scope.channelId, 'viewingLatest'], true);
    //   }, 3000);
    }
  };
}
