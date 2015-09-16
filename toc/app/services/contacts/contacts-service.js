export let serviceName = 'contacts';
export default /*@ngInject*/ function contacts(
  $q,
  $ionicPopup,
  buffer,
  channels,
  identity,
  notifications,
  R,
  state
) {
  let status;
  let network;

  let showAcceptInviteDialog = function showAcceptInviteDialog(channelId) {
    let contactId = state.cloud.channels
      .get([channelId, 'channelInfo', 'contactIds'])[0];
    let contact = state.cloud.contacts.get([contactId]);

    return notifications.dismiss(channelId)
      .then(() => $ionicPopup.show({
        template: `Accept invite from ${contact.userInfo.displayName || 'Anonymous'}?`,
        title: 'Accept Invite',
        buttons: [
          {
            text: 'Cancel',
            type: 'button-outline button-calm'
          },
          {
            text: 'Accept',
            type: 'button-outline button-balanced',
            onTap: (event) => {
              return saveAcceptingInvite(channelId);
            }
          }
        ]
      }));
  };

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
        .then(() => state.save(channelCursor, ['inviteStatus'], 'received'))
        .then(() => notifications.notify(newChannelInfo.id));
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
      return $q.reject('contact: missing existing channel');
    }

    if (existingChannel.inviteStatus === 'received') {
      return state.save(channelCursor, ['inviteStatus'], 'accepting')
        .then(() => buffer.addInvite(channelId));
    }

    return $q.when();
  };

  let saveSendingInvite = function saveSendingInvite(contactId) {
    let userInfo = state.cloud.identity.get('userInfo');
    if (contactId === userInfo.id) {
      return $q.reject('contact: cannot invite self');
    }

    let contactChannel = channels.createContactChannel(userInfo.id, contactId);
    let contactCursor = state.cloud.contacts.select([contactId]);
    let channelCursor = state.cloud.channels.select([contactChannel.id]);

    let existingChannel = channelCursor.get();

    if (existingChannel) {
      return $q.reject('contact: contact already exists');
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
        state.cloud.contacts,
        [contact.userInfo.id, 'statusId'],
        0
      ))
    )(allContacts);

    return $q.all(settingContactsToOffline);
  };

  return {
    showAcceptInviteDialog,
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
