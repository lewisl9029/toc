export default function contacts($q, R, state, network) {
  let invite = function inviteContact(contactId) {
    let userInfo = state.cloud.cursors.identity.get('userInfo');
    let contactChannel = network.createContactChannel(userInfo.id, contactId);

    let existingContact = state.cloud.cursors.contacts
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
        state.cloud.cursors.contacts,
        [contactId, 'userInfo'],
        contact
      ))
      .then(() => state.save(
        state.cloud.cursors.network,
        ['channels', contactChannel.id, 'channelInfo'],
        contactChannel
      ))
      .then(() => network.initializeChannel(contactChannel));
  };

  let initialize = function initializeContacts() {
    let contactsCursor = state.cloud.cursors.contacts;

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
