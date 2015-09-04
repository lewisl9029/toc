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
        updateStatus();
      };

      let updateStatus = () => {
        if (this.contact.statusId === -1) {
          this.status = 'toc-contact-status-pending';
          return;
        }

        if (this.contact.statusId === 0) {
          this.status = 'toc-contact-status-offline';
          return;
        }

        if (this.contact.statusId === 1) {
          this.status = 'toc-contact-status-online';
          return;
        }

        this.status = 'toc-contact-status-unknown';
      };

      let updateQuote = () => {
        if (this.channel.inviteStatus === 'accepting') {
          this.quote = `Accepting invite`;
          return;
        }

        if (this.channel.inviteStatus === 'sending') {
          this.quote = `Sending invite`;
          return;
        }

        if (this.channel.inviteStatus === 'sent') {
          this.quote = `Sent invite`;
          return;
        }

        if (this.channel.inviteStatus === 'received') {
          this.quote = 'Received invite';
          return;
        }

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

        this.quote = 'No new messages';
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
