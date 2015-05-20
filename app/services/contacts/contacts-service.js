export default function contacts($q, R, state, network) {
  let invite = function inviteContact(contactId) {
    let userInfo = state.synchronized.cursors.identity.get('userInfo');
    let contactChannel = network.createContactChannel(userInfo.id, contactId);

    let existingContact = state.synchronized.cursors.contacts
      .get([contactId, 'userInfo']);

    let contact = existingContact || {
      id: contactId,
      displayName: 'Invite Pending',
      email: 'unknown-user@toc-messenger.io'
    };

    const MAX_ATTEMPTS = 3;
    let attemptCount = 0;

    let recursivelySendInvite = () => {
      return network.sendInvite(contactId, userInfo)
        .catch((error) => {
          if (error !== 'timeout') {
            return $q.reject(error);
          }

          attemptCount++;
          if (attemptCount === MAX_ATTEMPTS) {
            return $q.reject('Invite request has timed out.');
          }

          return recursivelySendInvite();
        });
    };

    return recursivelySendInvite()
      .then(() => state.save(
        state.synchronized.cursors.contacts,
        [contactId, 'userInfo'],
        contact
      ))
      .then(() => state.save(
        state.synchronized.cursors.network,
        ['channels', contactChannel.id, 'channelInfo'],
        contactChannel
      ))
      .then(() => network.initializeChannel(contactChannel));
  };

  let initialize = function initializeContacts() {
    let contactsCursor = state.synchronized.cursors.contacts;

    R.pipe(
      R.keys,
      R.forEach((contactId) =>
        contactsCursor.set([contactId, 'statusId'], 0)
      )
    )(contactsCursor.get());

    return $q.when();
  };

  return {
    invite,
    initialize
  };
}
