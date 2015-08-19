export let serviceName = 'contacts';
export default /*@ngInject*/ function contacts(
  $q,
  channels,
  identity,
  network,
  R,
  state
) {
  let invite = function inviteContact(contactId) {
    let userInfo = state.cloud.identity.get('userInfo');
    let contactChannel = channels.createContactChannel(userInfo.id, contactId);

    let existingContact = state.cloud.contacts
      .get([contactId, 'userInfo']);

    let contact = existingContact || {
      id: contactId,
      displayName: 'Invite sent'
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
        state.cloud.channels,
        [contactChannel.id, 'channelInfo'],
        contactChannel
      ))
      .then(() => channels.initializeChannel(contactChannel))
      .then(() => network.listen(contactChannel))
      .then(() => contactChannel);
  };

  let initialize = function initializeContacts() {
    let contactsCursor = state.cloud.contacts;

    R.pipe(
      R.keys,
      R.forEach((contactId) => state.save(
        contactsCursor,
        [contactId, 'statusId'],
        0
      ))
    )(contactsCursor.get());

    return $q.when();
  };

  return {
    invite,
    initialize
  };
}
