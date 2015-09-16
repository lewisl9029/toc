export let serviceName = 'buffer';
export default /*@ngInject*/ function buffer(
  $interval,
  $q,
  $log,
  channels,
  state,
  R
) {
  let network;
  let status;

  let sendAttempts = {
    messages: undefined,
    invites: undefined,
    profiles: undefined
  };

  let sendMessage = function sendMessage(messageId, channelId) {
    let messageCursor = state.cloud.messages.select([channelId, messageId]);
    let messageInfo = messageCursor.get(['messageInfo']);
    let channelInfo = state.cloud.channels.get([channelId, 'channelInfo']);

    let contactId = channelInfo.contactIds[0];
    let contactStatusId = state.cloud.contacts.get([contactId, 'statusId']);
    if (contactStatusId === 0) {
      return;
    }

    let handleMessageAck = (ack) => {
      let receivedTime = ack.r;

      return state.save(messageCursor, ['receivedTime'], receivedTime)
        .then(() => removeMessage(messageInfo.id));
    };

    $log.debug(`Buffer: Sending message ${messageInfo.content} to ${channelId}`);
    return network.sendMessage(channelInfo, messageInfo)
      .then(handleMessageAck);
  };

  let addMessage = function addMessage(messageId, channelId) {
    if (sendAttempts.messages[messageId]) {
      return $q.when();
    }

    sendMessage(messageId, channelId);
    sendAttempts.messages[messageId] =
      $interval(() => sendMessage(messageId, channelId), 20000, 0, false);
    return state.save(
      state.cloud.buffer,
      ['messages', messageId],
      { messageId, channelId }
    );
  };

  let removeMessage = function removeMessage(messageId) {
    if (!sendAttempts.messages[messageId]) {
      return $q.when();
    }

    $interval.cancel(sendAttempts.messages[messageId]);
    sendAttempts.messages[messageId] = undefined;
    return state.remove(state.cloud.buffer, ['messages', messageId]);
  };

  let sendInvite = function sendInvite(channelId, userInfo) {
    let channelCursor = state.cloud.channels.select([channelId]);
    let existingChannel = channelCursor.get();
    let channelInfo = existingChannel.channelInfo;
    let contactId = channelInfo.contactIds[0];
    let contactCursor = state.cloud.contacts.select([contactId]);

    let handleInviteAck = (ack) => {
      let initializeChannel = () => {
        if (existingChannel.inviteStatus === 'sending') {
          return state.save(channelCursor, ['inviteStatus'], 'sent');
        }

        if (existingChannel.inviteStatus === 'accepting') {
          return state.remove(channelCursor, ['inviteStatus'])
            .then(() => state.save(contactCursor, ['statusId'], 1))
            .then(() => channels.initializeChannel(channelInfo))
            .then(() => network.listen(channelInfo))
            .then(() => status.initializeUpdates(contactId));
        }

        return $q.when();
      };

      return removeInvite(channelInfo.id)
        .then(initializeChannel);
    };

    let inviteChannelInfo = {
      id: channels.INVITE_CHANNEL_ID,
      contactIds: channelInfo.contactIds
    };

    $log.debug(`Buffer: Sending invite v${userInfo.version} to ${channelId}`);
    return network.sendInvite(inviteChannelInfo, userInfo)
      .then(handleInviteAck);
  };

  let addInvite = function addInvite(channelId) {
    let userInfo = state.cloud.identity.get(['userInfo']);
    let existingBufferedInvite = sendAttempts.invites[channelId];

    let removeExistingInvite = existingBufferedInvite ?
      removeInvite(channelId) : $q.when();

    return removeExistingInvite
      .then(() => {
        sendInvite(channelId, userInfo);
        sendAttempts.invites[channelId] =
          $interval(() => sendInvite(channelId, userInfo), 20000, 0, false);
        return $q.when();
      })
      .then(() => state.save(
        state.cloud.buffer,
        ['invites', channelId],
        {channelId}
      ));
  };

  let removeInvite = function removeInvite(channelId) {
    $interval.cancel(sendAttempts.invites[channelId]);
    sendAttempts.invites[channelId] = undefined;

    return state.remove(state.cloud.buffer, ['invites', channelId]);
  };

  let sendProfile = function sendProfile(channelId, userInfo) {
    let channelInfo = state.cloud.channels.get([channelId, 'channelInfo']);

    let contactId = channelInfo.contactIds[0];
    let contactStatusId = state.cloud.contacts.get([contactId, 'statusId']);
    if (contactStatusId === 0) {
      return;
    }

    let handleProfileAck = (ack) => {
      return removeProfile(channelInfo.id);
    };

    $log.debug(`Buffer: Sending profile v${userInfo.version} to ${channelId}`);
    return network.sendProfile(channelInfo, userInfo)
      .then(handleProfileAck);
  };

  let addProfile = function addProfile(channelId) {
    let userInfo = state.cloud.identity.get(['userInfo']);
    let existingBufferedProfile = sendAttempts.profiles[channelId];

    let removeExistingProfile = existingBufferedProfile ?
      removeProfile(channelId) : $q.when();

    return removeExistingProfile
      .then(() => {
        sendProfile(channelId, userInfo);
        sendAttempts.profiles[channelId] =
          $interval(() => sendProfile(channelId, userInfo), 20000, 0, false);
        return $q.when();
      })
      .then(() => state.save(
        state.cloud.buffer,
        ['profiles', channelId],
        {channelId}
      ));
  };

  let removeProfile = function removeProfile(channelId) {
    $interval.cancel(sendAttempts.profiles[channelId]);
    sendAttempts.profiles[channelId] = undefined;

    return state.remove(state.cloud.buffer, ['profiles', channelId]);
  };

  let initialize = function initialize(networkService, statusService) {
    network = networkService;
    status = statusService;

    let bufferedMessages = state.cloud.buffer.get(['messages']);

    sendAttempts.messages = R.mapObj((messageBuffer) => {
      let channelId = messageBuffer.channelId;
      let messageId = messageBuffer.messageId;

      //TODO: try staggering the initial send and retry intervals
      // may not actually be more performant because it would trigger more
      // digest cycles in angular
      sendMessage(messageId, channelId);
      return $interval(() => sendMessage(messageId, channelId), 20000, 0, false);
    })(bufferedMessages);

    let bufferedProfiles = state.cloud.buffer.get(['profiles']);
    let userInfo = state.cloud.identity.get(['userInfo']);

    sendAttempts.profiles = R.mapObj((profileBuffer) => {
      let channelId = profileBuffer.channelId;

      sendProfile(channelId, userInfo);
      return $interval(() => sendProfile(channelId, userInfo), 20000, 0, false);
    })(bufferedProfiles);

    let bufferedInvites = state.cloud.buffer.get(['invites']);

    sendAttempts.invites = R.mapObj((inviteBuffer) => {
      let channelId = inviteBuffer.channelId;

      sendInvite(channelId, userInfo);
      return $interval(() => sendInvite(channelId, userInfo), 60000, 0, false);
    })(bufferedInvites);

    return $q.when();
  };

  return {
    addMessage,
    addProfile,
    addInvite,
    initialize
  };
}
