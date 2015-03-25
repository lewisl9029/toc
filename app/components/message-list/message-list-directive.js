import template from './message-list.html!text';

export default function tocMessageList(network, state, R,
  $ionicScrollDelegate) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      channelId: '@'
    },
    link: function linkMessageList(scope) {
      let messagesCursor = network.NETWORK_CURSORS.synchronized
        .select(['channels', scope.channelId, 'messages']);

      $ionicScrollDelegate.scrollBottom(false);

      messagesCursor.on('update', () => {
        let scrollView = $ionicScrollDelegate.getScrollView();

        if (scrollView.__scrollTop !== scrollView.__maxScrollTop) {
          return;
        }

        $ionicScrollDelegate.scrollBottom(true);

        let messages = messagesCursor.get();

        R.pipe(
          R.values,
          //FIXME: figure out why R.not doesnt work here
          // R.filter(R.pipe(R.prop('isRead'), R.not),
          R.filter(R.pipe(R.prop('isRead'), (bool) => !bool)),
          R.forEach((message) => state.save(
            messagesCursor,
            [message.messageInfo.id, 'isRead'],
            true
          ))
        )(messages);
      });
    },
    controllerAs: 'messageList',
    controller: function MessageListController($scope, $state, identity,
      contacts, $interval) {
      let channelsCursor = network.NETWORK_CURSORS.synchronized
        .select('channels');

      let contactsCursor = contacts.CONTACTS_CURSORS.synchronized;
      let identityCursor = identity.IDENTITY_CURSORS.synchronized;

      let messagesCursor = network.NETWORK_CURSORS.synchronized
        .select(['channels', $scope.channelId, 'messages']);

      this.contacts = contactsCursor.get();
      this.userInfo = identityCursor.get(['userInfo']);

      let getMessageList = function getMessageList(messages) {
        return R.pipe(
          R.values,
          R.sort((message1, message2) => {
            if (message1.messageInfo.logicalClock ===
              message2.messageInfo.logicalClock) {
              return message1.messageInfo.id > message2.messageInfo.id ?
                1 : -1;
            }

            return message1.messageInfo.logicalClock >
              message2.messageInfo.logicalClock ?
              1 : -1;
          }),
          R.reduce((groupedMessages, message) => {
            let messageVm = message.messageInfo;
            messageVm.isRead = message.isRead;

            if (groupedMessages.length === 0) {
              groupedMessages.push([messageVm]);
              return groupedMessages;
            }

            let latestGroup = groupedMessages[groupedMessages.length - 1];

            if (latestGroup[0].sender === messageVm.sender) {
              latestGroup.push(messageVm);
            } else {
              groupedMessages.push([messageVm]);
            }

            return groupedMessages;
          }, [])
        )(messages);
      };

      this.groupedMessages = getMessageList(messagesCursor.get());

      messagesCursor.on('update', () => {
        this.groupedMessages = getMessageList(messagesCursor.get());
      });

      //TODO: write a more performant version of this
      $interval(() => {
        let scrollView = $ionicScrollDelegate.getScrollView();

        if (scrollView.__scrollTop !== scrollView.__maxScrollTop) {
          if (!channelsCursor.get([$scope.channelId, 'viewingLatest'])) {
            return;
          }

          return state.save(
            channelsCursor,
            [$scope.channelId, 'viewingLatest'],
            false
          );
        }

        let messages = messagesCursor.get();

        R.pipe(
          R.values,
          //FIXME: figure out why R.not doesnt work here
          // R.filter(R.pipe(R.prop('isRead'), R.not),
          R.filter(R.pipe(R.prop('isRead'), (bool) => !bool)),
          R.forEach((message) => state.save(
            messagesCursor,
            [message.messageInfo.id, 'isRead'],
            true
          ))
        )(messages);

        if (channelsCursor.get([$scope.channelId, 'viewingLatest'])) {
          return;
        }
        state.save(channelsCursor, [$scope.channelId, 'viewingLatest'], true);
      }, 3000);
    }
  };
}
