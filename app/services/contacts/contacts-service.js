export let serviceName = 'contacts';
export default /*@ngInject*/ function contacts(
  $q,
  buffer,
  channels,
  identity,
  network,
  R,
  state
) {
  let saveReceivedProfile = function saveReceivedProfile(
    profilePayload, channelId
  ) {
    let contactInfo = profilePayload;
    let contactCursor = state.cloud.contacts.select([contactInfo.id]);
    let existingContactInfo = contactCursor.get(['userInfo']);

    if (existingContactInfo.version > contactInfo.version) {
      return $q.when();
    }

    return state.save(contactCursor, ['userInfo'], contactInfo);

    // if (channelId !== channels.INVITE_CHANNEL_ID) {
    //
    // }
    //
    // return state.save(contactCursor, ['userInfo'], contactInfo)
    //   .then(() => state.save(contactCursor, ['statusId'], 1))
    //   .then(() => state.save(
    //     state.cloud.channels,
    //     [channel.id, 'channelInfo'],
    //     channel
    //   ))
    //
    // if (!existingContactInfo) {
    //
    // }
    // // otherwise it's a sent invite
  };

  let saveAcceptingInvite = function saveAcceptingInvite(channelId) {
    
  };

  let saveSendingInvite = function saveSendingInvite(contactId) {
    let contactChannel = channels.createContactChannel(userInfo.id, contactId);
    let contactCursor = state.cloud.channels.select([contactId]);
    let channelCursor = state.cloud.channels.select([contactChannel.id]);

    let contactInfo = {
      version: 0,
      id: contactId
    };

    return buffer.addInvite(contactId)
      .then(() => state.save(contactCursor, ['userInfo'], contactInfo))
      .then(() => state.save(channelCursor, ['channelInfo'], contactChannel))
      .then(() => state.save(channelCursor, ['sendingInvite'], true));
      // .then(() => channels.initializeChannel(contactChannel))
      // .then(() => network.listen(contactChannel));
  };

  let saveSendingProfile = function saveSendingProfile(channelId) {
    return buffer.addProfile(channelId);
  };

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
      R.values,
      R.reject(R.propEq('statusId', 0)),
      R.forEach((contact) => state.save(
        contactsCursor,
        [contact.userInfo.id, 'statusId'],
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
