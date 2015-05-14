import template from './channel-list.html!text';

export default function tocChannelList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'channelList',
    controller: function ChannelListController($q, $state, state, contacts,
      notification) {
      //TODO: optimize by pulling cursors into service
      this.channelId = $state.params.channelId;

      let networkCursor = state.synchronized.cursors.network;
      let channelsCursor = networkCursor.select(['channels']);
      let contactsCursor = state.synchronized.cursors.contacts;

      let identityCursor = state.synchronized.cursors.identity;

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
          networkCursor,
          ['activeChannelId'],
          channelId
        ).then(() => $state.go('app.channel', {channelId: channelId}));
      };

      this.goToHome = function goToHome() {
        return state.save(
          networkCursor,
          ['activeChannelId'],
          'home'
        ).then(() => $state.go('app.home'));
      };

      identityCursor.on('update', () => {
        this.userInfo = identityCursor.get('userInfo');
      });

      channelsCursor.on('update', () => {
        this.channels = channelsCursor.get();
      });

      contactsCursor.on('update', () => {
        this.contacts = contactsCursor.get();
      });
    }
  };
}
