export default function contacts($log, state, network, identity, channels) {
  const CONTACTS_PATH = ['contacts'];
  const CONTACTS_CURSORS = {
    synchronized: state.synchronized.tree.select(CONTACTS_PATH)
  };

  let invite = function inviteContact(contactId) {
    let userInfo = identity.IDENTITY_CURSORS.synchronized.get('userInfo');
    let contactChannel = channels.createContactChannel(userInfo.id, contactId);

    let inviteChannel = {
      id: channels.INVITE_CHANNEL_ID,
      contactIds: contactChannel.contactIds
    };

    let contact = {
      id: contactId,
      displayName: 'Invite Pending',
      email: 'unknown-user@toc-messenger.io'
    };

    return network.send(contactChannel, userInfo)
      .then(() => state.save(
        CONTACTS_CURSORS.synchronized,
        [contactId, 'userInfo'],
        contact
      )).then(() => state.save(
        channels.CHANNELS_CURSORS.synchronized,
        [contactChannel.id, 'channelInfo'],
        contactChannel
      )).then(() => network.listen(contactChannel))
      .catch($log.error);
  };

  let initialize = function initilizeContacts() {

  };

  return {
    CONTACTS_CURSORS,
    invite,
    initialize
  };
}
