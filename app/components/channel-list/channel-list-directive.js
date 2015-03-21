import template from './channel-list.html!text';

export default function tocChannelList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'channelList',
    controller: function ChannelListController($state, contacts, network,
      identity) {
      //TODO: optimize by pulling cursors into service
      let channelsCursor =
        network.NETWORK_CURSORS.synchronized.select(['channels']);
      let contactsCursor = contacts.CONTACTS_CURSORS.synchronized;

      let identityCursor = identity.IDENTITY_CURSORS.synchronized;

      this.userInfo = identityCursor.get('userInfo');

      this.channels = channelsCursor.get();
      this.contacts = contactsCursor.get();

      this.inviteId = '';
      this.invite = (contactId) => {
        return contacts.invite(contactId)
          .catch((error) => {
            
          });
      };

      channelsCursor.on('update', () => {
        this.channels = channelsCursor.get();
      });

      contactsCursor.on('update', () => {
        this.contacts = contactsCursor.get();
      });
    }
  };
}
