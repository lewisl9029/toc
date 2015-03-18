export default function contacts($log, state, network, identity) {
  const CONTACTS_PATH = ['contacts'];
  const CONTACTS_CURSORS = {
    synchronized: state.synchronized.tree.select(CONTACTS_PATH)
  };

  let invite = function inviteContact(contactId) {
    let userInfo = identity.IDENTITY_CURSORS.synchronized.get('userInfo');
    let contactChannel = network.createContactChannel(userInfo.id, contactId);

    let existingContact = CONTACTS_CURSORS.synchronized
      .get([contactId, 'userInfo']);

    let contact = existingContact || {
      id: contactId,
      displayName: 'Invite Pending',
      email: 'unknown-user@toc-messenger.io'
    };

    return network.sendInvite(contactId, userInfo)
      .then(() => state.save(
        CONTACTS_CURSORS.synchronized,
        [contactId, 'userInfo'],
        contact
      )).then(() => state.save(
        network.NETWORK_CURSORS.synchronized,
        ['channels', contactChannel.id, 'channelInfo'],
        contactChannel
      )).then(() => network.listen(contactChannel));
  };

  let initialize = function initilizeContacts() {

  };

  return {
    CONTACTS_CURSORS,
    invite,
    initialize
  };
}
