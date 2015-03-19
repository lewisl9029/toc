export default function ChannelController($stateParams, state, contacts,
  network) {
  let channelId = $stateParams.channelId;

  let channelCursor = network.NETWORK_CURSORS.synchronized
    .select('channels');

  this.title = contacts.CONTACTS_CURSORS.synchronized
    .get(
      channelCursor.get([channelId, 'channelInfo', 'contactIds'])[0]
    ).userInfo.displayName;

  let messagesCursor = channelCursor.select([
    channelId,
    'messages'
  ]);

  this.messages = messagesCursor.get();

  messagesCursor.on('update', () => {
    this.messages = messagesCursor.get();
  });

  this.currentMessage = '';
}
