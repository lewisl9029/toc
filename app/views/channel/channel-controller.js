export let controllerName = 'ChannelController';
export default /*@ngInject*/ function ChannelController(
  $q,
  $scope,
  $stateParams,
  $ionicScrollDelegate,
  identity,
  network,
  messages,
  state
) {
  this.channelId = $stateParams.channelId;

  let channelCursor = state.cloud.channels.select([this.channelId]);
  let contactCursor = state.cloud.contacts;

  let updateContact = () => {
    this.contact = contactCursor.get(
      this.channel.channelInfo.contactIds[0]
    );
  };

  let updateChannel = () => {
    this.channel = channelCursor.get();
    updateContact();
  };

  state.addListener(channelCursor, updateChannel, $scope);
  state.addListener(contactCursor, updateContact, $scope);

  this.viewLatest = () => {
    $ionicScrollDelegate.scrollBottom(true);
  };

  this.message = '';

  this.send = () => {
    let message = this.message;
    this.message = '';

    return messages.saveSendingMessage(this.channelId, message);
  };
}
