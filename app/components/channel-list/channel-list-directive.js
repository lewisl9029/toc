import template from './channel-list.html!text';

export default function tocChannelList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'channelList',
    controller: function ChannelListController($state, contacts, network) {
      //TODO: optimize by pulling cursors into service
      let channelsCursor =
        network.NETWORK_CURSORS.synchronized.select(['channels']);
      let contactsCursor = contacts.CONTACTS_CURSORS.synchronized;

      this.channels = channelsCursor.get();
      this.contacts = contactsCursor.get();

      this.inviteId = '';
      this.invite = contacts.invite;

      channelsCursor.on('update', () => {
        this.channels = channelsCursor.get();
      });

      contactsCursor.on('update', () => {
        this.contacts = contactsCursor.get();
      });
    }
  };
}
