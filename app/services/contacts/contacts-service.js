export default function contacts($log, state, network, identity) {
  const CONTACTS_PATH = ['contacts'];
  const CONTACTS_CURSORS = {
    synchronized: state.synchronized.tree.select(CONTACTS_PATH)
  };

  let invite = function inviteContact(contactId) {
    let userInfo = identity.IDENTITY_CURSORS.synchronized.get('userInfo');
    let contactChannel = network.createContactChannel(userInfo.id, contactId);

    let inviteChannel = {
      id: network.INVITE_CHANNEL_ID,
      contactIds: contactChannel.contactIds
    };

    let contact = {
      id: contactId,
      displayName: 'Invite Pending',
      email: 'unknown-user@toc-messenger.io'
    };

    return network.send(inviteChannel, userInfo)
      .then(() => state.save(
        CONTACTS_CURSORS.synchronized,
        [contactId, 'userInfo'],
        contact
      )).then(() => state.save(
        network.NETWORK_CURSORS.synchronized,
        ['channels', contactChannel.id, 'channelInfo'],
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
