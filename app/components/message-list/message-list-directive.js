import template from './message-list.html!text';

export default function tocMessageList() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      channelId: '@'
    },
    controllerAs: 'messageList',
    controller: function MessageListController($scope, $state, contacts,
      network) {
      let channelsCursor = network.NETWORK_CURSORS.synchronized
        .select('channels');

      let messagesCursor = channelsCursor.select([
        $scope.channelId,
        'messages'
      ]);

      // this.messages = {
      //   6: {content: '1234'},
      //   5: {content: '1234'},
      //   4: {content: '1234'},
      //   3: {content: '1234'},
      //   2: {content: '1234'},
      // };
      this.messages = messagesCursor.get();

      messagesCursor.on('update', () => {
        this.messages = messagesCursor.get();
      });
    }
  };
}
