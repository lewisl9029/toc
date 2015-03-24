import template from './channel-list.html!text';

export default function tocChannelList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'channelList',
    controller: function ChannelListController($state, contacts, network,
      identity, notification) {
      //TODO: optimize by pulling cursors into service
      let channelsCursor =
        network.NETWORK_CURSORS.synchronized.select(['channels']);
      let contactsCursor = contacts.CONTACTS_CURSORS.synchronized;

      let identityCursor = identity.IDENTITY_CURSORS.synchronized;

      this.userInfo = identityCursor.get('userInfo');

      this.channels = channelsCursor.get();
      this.contacts = contactsCursor.get();

      this.inviteId = '';
      this.inviteInProgress;
      this.invite = () => {
        this.inviteInProgress = true;
        return contacts.invite(this.inviteId)
          .catch((error) =>
            notification.error(error, 'Contact Invite Send Error')
          )
          .then(() => {
            this.inviteInProgress = false;
          });
      };

      this.invitesAcceptanceInProgress = {};

      this.acceptInvite = (channelInfo) => {
        this.invitesAcceptanceInProgress[channelInfo.id] = true;
        return contacts.invite(channelInfo.contactIds[0])
          .catch((error) =>
            notification.error(error, 'Contact Invite Accept Error')
          )
          .then(() => {
            this.invitesAcceptanceInProgress[channelInfo.id] = false;
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
