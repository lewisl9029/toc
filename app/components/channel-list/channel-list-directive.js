import template from './channel-list.html!text';

export default function tocChannelList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'channelList',
    controller: function ChannelListController($q, $state, state, contacts,
      network, identity, notification) {
      //TODO: optimize by pulling cursors into service
      this.channelId = $state.params.channelId;

      let channelsCursor =
        network.NETWORK_CURSORS.synchronized.select(['channels']);
      let contactsCursor = contacts.CONTACTS_CURSORS.synchronized;

      let identityCursor = identity.IDENTITY_CURSORS.synchronized;

      this.userInfo = identityCursor.get('userInfo');

      this.channels = channelsCursor.get();
      this.contacts = contactsCursor.get();

      this.inviteId = '';
      this.invite = () => {
        this.inviting = contacts.invite(this.inviteId)
          .then(() => {
            this.inviteId = '';
            return $q.when();
          })
          .catch((error) =>
            notification.error(error, 'Contact Invite Send Error')
          );

        return this.inviting;
      };

      this.invitesAccepting = {};

      this.acceptInvite = (channelInfo) => {
        this.invitesAccepting[channelInfo.id] =
          contacts.invite(channelInfo.contactIds[0])
            .catch((error) =>
              notification.error(error, 'Contact Invite Accept Error')
            );
        return this.invitesAccepting[channelInfo.id];
      };

      this.goToChannel = function goToChannel(channelId) {
        return state.save(
          network.NETWORK_CURSORS.synchronized,
          ['activeChannelId'],
          channelId
        ).then(() => $state.go('app.channel', {channelId: channelId}));
      };

      this.goToHome = function goToHome() {
        return state.save(
          network.NETWORK_CURSORS.synchronized,
          ['activeChannelId'],
          'home'
        ).then(() => $state.go('app.home'));
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
