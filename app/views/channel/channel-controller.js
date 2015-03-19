export default function ChannelController($log, $stateParams, state, contacts,
  network) {
  this.channelId = $stateParams.channelId;

  let channelCursor = network.NETWORK_CURSORS.synchronized
    .select('channels');

  this.title = contacts.CONTACTS_CURSORS.synchronized
    .get(
      channelCursor.get([this.channelId, 'channelInfo', 'contactIds'])[0]
    ).userInfo.displayName;

  this.message = '';
  this.send = () => {
    return network.sendMessage(
        channelCursor.get([this.channelId, 'channelInfo']),
        this.message
      )
      .catch($log.error);
  };
}
