import template from './channel-card.html!text';

export let directiveName = 'tocChannelCard';
export default /*@ngInject*/ function tocChannelCard() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      channelId: '@'
    },
    controllerAs: 'channelCard',
    controller: /*@ngInject*/ function ChannelCardController(
      $scope,
      identity,
      state
    ) {
      this.getAvatar = identity.getAvatar;
      this.channelId = $scope.channelId;

      let channelCursor = state.cloud.channels.select([this.channelId]);
      let messagesCursor = state.cloud.messages.select([this.channelId]);
      let contactCursor = state.cloud.contacts;

      let updateContact = () => {
        this.contact = contactCursor.get(
          this.channel.channelInfo.contactIds[0]
        );
      };

      let updateQuote = () => {
        if (this.channel.unreadMessageId) {
          this.quote = messagesCursor.get(this.channel.unreadMessageId)
            .messageInfo.content;
          return;
        }

        if (this.channel.latestMessageId) {
          this.quote = messagesCursor.get(this.channel.latestMessageId)
            .messageInfo.content;
          return;
        }

        this.quote = '...';
      };

      let updateChannel = () => {
        this.channel = channelCursor.get();
        updateContact();
        updateQuote();
      };
      state.addListener(channelCursor, updateChannel, $scope);
      state.addListener(contactCursor, updateContact, $scope);
    }
  };
}
