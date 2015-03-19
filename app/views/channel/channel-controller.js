export default function ChannelController($log, $stateParams, state, contacts,
  network) {
  this.channelId = $stateParams.channelId;

  let channelCursor = network.NETWORK_CURSORS.synchronized
    .select('channels');

  let contactCursor = contacts.CONTACTS_CURSORS.synchronized;

  this.contact = contactCursor.get(
    channelCursor.get([this.channelId, 'channelInfo', 'contactIds'])[0]
  );

  this.title = this.contact.userInfo.displayName;

  this.message = '';
  this.send = () => {
    return network.sendMessage(
        channelCursor.get([this.channelId, 'channelInfo']),
        this.message
      )
      .catch($log.error);
  };

  contactCursor.on('change', () => {
    this.contact = contactCursor.get(
      channelCursor.get([this.channelId, 'channelInfo', 'contactIds'])[0]
    );
  });
}
