export default function contacts($q, R, state, network) {
  let invite = function inviteContact(contactId) {
    let userInfo = state.cloud.identity.get('userInfo');
    let contactChannel = network.createContactChannel(userInfo.id, contactId);

    let existingContact = state.cloud.contacts
      .get([contactId, 'userInfo']);

    // MD5 of 'unknown-user@toc.im'
    let emailHash = '5ae4d25a9f2a3ea7d90f495711b34486';

    let contact = existingContact || {
      id: contactId,
      displayName: 'Invite Pending',
      email: 'unknown-user@toc.im',
      avatar: `http://cdn.libravatar.org/avatar/${emailHash}?d=identicon`
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
        state.cloud.contacts,
        [contactId, 'userInfo'],
        contact
      ))
      .then(() => state.save(
        state.cloud.network,
        ['channels', contactChannel.id, 'channelInfo'],
        contactChannel
      ))
      .then(() => network.initializeChannel(contactChannel));
  };

  let initialize = function initializeContacts() {
    let contactsCursor = state.cloud.contacts;

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
