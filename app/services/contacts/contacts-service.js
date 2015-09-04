export let serviceName = 'contacts';
export default /*@ngInject*/ function contacts(
  $q,
  buffer,
  channels,
  identity,
  R,
  state
) {
  let status;
  let network;

  let saveContactInfo = function saveContactInfo(contactInfo) {
    let contactCursor = state.cloud.contacts.select([contactInfo.id]);
    let existingContactInfo = contactCursor.get(['userInfo']);

    if (existingContactInfo &&
      existingContactInfo.version > contactInfo.version
    ) {
      return $q.when();
    }

    return state.save(contactCursor, ['userInfo'], contactInfo);
  };

  let saveReceivedProfile = function saveReceivedProfile(profilePayload) {
    let contactInfo = profilePayload;
    return saveContactInfo(contactInfo);
  };

  let saveSendingProfile = function saveSendingProfile(channelId) {
    return buffer.addProfile(channelId);
  };

  let saveReceivedInvite = function saveReceivedInvite(invitePayload) {
    let contactInfo = invitePayload;

    let userId = state.cloud.identity.get(['userInfo']).id;
    let newChannelInfo = channels.createContactChannel(userId, contactInfo.id);
    let contactCursor = state.cloud.contacts.select([contactInfo.id]);
    let channelCursor = state.cloud.channels.select([newChannelInfo.id]);

    let existingChannel = channelCursor.get();

    if (!existingChannel) {
      return saveContactInfo(contactInfo)
        .then(() => state.save(contactCursor, ['statusId'], -1))
        .then(() => state.save(channelCursor, ['channelInfo'], newChannelInfo))
        .then(() => state.save(channelCursor, ['inviteStatus'], 'received'));
    }

    if (existingChannel.inviteStatus === 'sent') {
      return saveContactInfo(contactInfo)
        .then(() => state.remove(channelCursor, ['inviteStatus']))
        .then(() => state.save(contactCursor, ['statusId'], 1))
        .then(() => channels.initializeChannel(existingChannel.channelInfo))
        .then(() => network.listen(existingChannel.channelInfo))
        .then(() => status.initializeUpdates(contactInfo.id));
    }

    return $q.when();
  };

  let saveAcceptingInvite = function saveAcceptingInvite(channelId) {
    let channelCursor = state.cloud.channels.select([channelId]);
    let existingChannel = channelCursor.get();

    if (!existingChannel) {
      return $q.reject('missing existing channel for invite accept');
    }

    if (existingChannel.inviteStatus === 'received') {
      return state.save(channelCursor, ['inviteStatus'], 'accepting')
        .then(() => buffer.addInvite(channelId));
    }

    return $q.when();
  };

  let saveSendingInvite = function saveSendingInvite(contactId) {
    let userInfo = state.cloud.identity.get('userInfo');
    let contactChannel = channels.createContactChannel(userInfo.id, contactId);
    let contactCursor = state.cloud.contacts.select([contactId]);
    let channelCursor = state.cloud.channels.select([contactChannel.id]);

    let existingChannel = channelCursor.get();

    if (existingChannel) {
      return $q.when();
    }

    let contactInfo = {
      version: 0,
      id: contactId
    };

    return state.save(contactCursor, ['userInfo'], contactInfo)
      .then(() => state.save(contactCursor, ['statusId'], -1))
      .then(() => state.save(channelCursor, ['channelInfo'], contactChannel))
      .then(() => state.save(channelCursor, ['inviteStatus'], 'sending'))
      .then(() => buffer.addInvite(contactChannel.id));
  };

  let saveProfileUpdates = function saveProfileUpdates() {
    let userInfo = state.cloud.identity.get('userInfo');
    let existingChannels = state.cloud.channels.get();

    let savingSendingProfiles = R.pipe(
      R.values,
      R.map((channel) => saveSendingProfile(channel.channelInfo.id))
    ) (existingChannels);

    return $q.all(savingSendingProfiles);
  };

  let initialize = function initializeContacts(statusService, networkService) {
    status = statusService;
    network = networkService;

    let allContacts = state.cloud.contacts.get();

    let settingContactsToOffline = R.pipe(
      R.values,
      R.filter(R.propEq('statusId', 1)),
      R.map((contact) => state.save(
        contactsCursor,
        [contact.userInfo.id, 'statusId'],
        0
      ))
    )(allContacts);

    return $q.all(settingContactsToOffline);
  };

  return {
    saveContactInfo,
    saveReceivedProfile,
    saveSendingProfile,
    saveReceivedInvite,
    saveAcceptingInvite,
    saveSendingInvite,
    saveProfileUpdates,
    initialize
  };
}
