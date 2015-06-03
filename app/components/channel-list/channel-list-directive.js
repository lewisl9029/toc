import template from './channel-list.html!text';

export default function tocChannelList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'channelList',
    controller: function ChannelListController($q, $state, state, contacts,
      notification, $ionicHistory, $scope) {
      this.channelId = $state.params.channelId;

      let identityCursor = state.cloud.identity;
      let updateUserInfo = () => {
        this.userInfo = identityCursor.get('userInfo');
      };

      state.addListener(identityCursor, updateUserInfo, $scope);

      let networkCursor = state.cloud.network;
      let channelsCursor = networkCursor.select(['channels']);
      let updateChannels = () => {
        this.channels = channelsCursor.get();
      };

      state.addListener(channelsCursor, updateChannels, $scope);

      let contactsCursor = state.cloud.contacts;
      let updateContacts = () => {
        this.contacts = contactsCursor.get();
      };

      state.addListener(contactsCursor, updateContacts, $scope);

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
        let activeChannelId = state.cloud.network.get(
          ['activeChannelId']
        );

        if (activeChannelId !== channelId) {
          state.save(
            state.cloud.network,
            ['activeChannelId'],
            channelId
          );
        }

        $ionicHistory.nextViewOptions({
          disableBack: true,
          disableAnimate: true
        });

        return $state.go('app.channel', {channelId: channelId});
      };

      this.goToHome = function goToHome() {
        let activeChannelId = state.cloud.network.get(
          ['activeChannelId']
        );

        if (activeChannelId !== 'home') {
          state.save(
            state.cloud.network,
            ['activeChannelId'],
            'home'
          );
        }

        $ionicHistory.nextViewOptions({
          disableBack: true,
          disableAnimate: true
        });

        return $state.go('app.home');
      };
    }
  };
}
