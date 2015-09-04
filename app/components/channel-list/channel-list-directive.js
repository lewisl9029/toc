import template from './channel-list.html!text';

export let directiveName = 'tocChannelList';
export default /*@ngInject*/ function tocChannelList() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'channelList',
    controller: /*@ngInject*/ function ChannelListController(
      $ionicHistory,
      $ionicPopup,
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

      this.handleClick = function handleChannelClick(channel) {
        if (channel.inviteStatus === 'sent' ||
          channel.inviteStatus === 'sending' ||
          channel.inviteStatus === 'accepting'
        ) {
          return;
        }

        if (channel.inviteStatus === 'received') {
          let contactId = channel.channelInfo.contactIds[0];
          let contact = state.cloud.contacts.get([contactId]);

          return $ionicPopup.show({
            template: `Accept invite from ${contact.userInfo.displayName || 'Anonymous'}?`,
            title: 'Accept Invite',
            buttons: [
              {
                text: 'Cancel',
                type: 'button-outline button-calm'
              },
              {
                text: 'Accept',
                type: 'button-outline button-balanced',
                onTap: (event) => {
                  return contacts.saveAcceptingInvite(channelId);
                }
              }
            ]
          });
        }

        return navigation.navigate(channel.channelInfo.id);
      };

      this.goToChannel = function goToChannel(channelId) {
        return navigation.navigate(channelId);
      };
    }
  };
}
