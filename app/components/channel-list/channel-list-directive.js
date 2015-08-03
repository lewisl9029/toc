import template from './channel-list.html!text';

export let directiveName = 'tocChannelList';
export default /*@ngInject*/ function tocChannelList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'channelList',
    controller: /*@ngInject*/ function ChannelListController(
      $ionicHistory,
      $q,
      $scope,
      $state,
      contacts,
      identity,
      navigation,
      notification,
      state
    ) {
      this.getAvatar = identity.getAvatar;

      let channelIdCursor = state.cloud.navigation.select(['activeChannelId']);
      let updateChannelId = () => {
        this.channelId = channelIdCursor.get();
      };
      state.addListener(channelIdCursor, updateChannelId, $scope);

      let identityCursor = state.cloud.identity;
      let updateUserInfo = () => {
        this.userInfo = identityCursor.get('userInfo');
      };
      state.addListener(identityCursor, updateUserInfo, $scope);

      let channelsCursor = state.cloud.channels;
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
        $ionicHistory.nextViewOptions({
          disableBack: true,
          disableAnimate: false
        });

        return navigation.go(
            navigation.app.private.channel,
            {channelId: channelId}
          )
          .then(() => state.save(
            state.cloud.navigation,
            ['activeChannelId'],
            channelId
          ));
      };

      this.goToHome = function goToHome() {
        $ionicHistory.nextViewOptions({
          disableBack: true,
          disableAnimate: false
        });

        return navigation.go(navigation.app.private.home)
          .then(() => state.save(
            state.cloud.navigation,
            ['activeChannelId'],
            'home'
          ));
      };
    }
  };
}
