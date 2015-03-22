import template from './message-list.html!text';

export default function tocMessageList() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      channelId: '@'
    },
    controllerAs: 'messageList',
    controller: function MessageListController($scope, $state, identity,
      contacts, network) {
      let channelsCursor = network.NETWORK_CURSORS.synchronized
        .select('channels');
      let contactsCursor = contacts.CONTACTS_CURSORS.synchronized;
      let identityCursor = identity.IDENTITY_CURSORS.synchronized;

      let messagesCursor = channelsCursor.select([
        $scope.channelId,
        'messages'
      ]);

      this.contacts = contactsCursor.get();
      this.userId = identityCursor.get(['userInfo']).id;

      this.messages = messagesCursor.get();

      messagesCursor.on('update', () => {
        this.messages = messagesCursor.get();
      });
    }
  };
}
