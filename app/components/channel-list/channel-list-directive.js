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
      state
    ) {
      let viewIdCursor = state.cloud.navigation.select(['activeViewId']);
      let updateViewId = () => {
        this.viewId = viewIdCursor.get();
      };
      state.addListener(viewIdCursor, updateViewId, $scope);

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
          });

        return this.inviting;
      };

      this.invitesAccepting = {};

      this.acceptInvite = (channelInfo) => {
        this.invitesAccepting[channelInfo.id] =
          contacts.invite(channelInfo.contactIds[0]);
        return this.invitesAccepting[channelInfo.id];
      };

      this.goToChannel = function goToChannel(channelId) {
        return navigation.goFromMenu(channelId);
      };
    }
  };
}
