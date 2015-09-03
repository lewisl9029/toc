export let serviceName = 'buffer';
export default /*@ngInject*/ function buffer(
  $interval,
  $q,
  state,
  R
) {
  let network;

  let sendAttempts = {
    messages: undefined,
    invites: undefined,
    profiles: undefined
  };

  let bufferedMessagesCursor = state.cloud.buffer.select(['messages']);
  let bufferedProfilesCursor = state.cloud.buffer.select(['profiles']);
  let bufferedInvitesCursor = state.cloud.buffer.select(['invites']);

  let sendMessage = function sendMessage(messageId, channelId) {
    let messageCursor = state.cloud.messages.select([channelId, messageId]);
    let messageInfo = messageCursor.get(['messageInfo']);
    let channelInfo = state.cloud.channels.get([channelId, 'channelInfo']);

    let handleMessageAck = (ack) => {
      let receivedTime = ack.r;

      return state.save(messageCursor, ['receivedTime'], receivedTime)
        .then(() => removeMessage(messageInfo.id));
    };

    return network.sendMessage(channelInfo, messageInfo)
      .then(handleMessageAck);
  };

  let addMessage = function addMessage(messageId, channelId) {
    if (sendAttempts.messages[messageId]) {
      return $q.when();
    }

    sendMessage(messageId, channelId);
    sendAttempts.messages[messageId] =
      $interval(() => sendMessage(messageId, channelId), 20000);
    return state.save(
      bufferedMessagesCursor,
      [messageId],
      { messageId, channelId }
    );
  };

  let removeMessage = function removeMessage(messageId) {
    if (!sendAttempts.messages[messageId]) {
      return $q.when();
    }

    $interval.cancel(sendAttempts.messages[messageId]);
    sendAttempts.messages[messageId] = undefined;
    return state.remove(bufferedMessagesCursor, [messageId]);
  };

  let addInvite = function addInvite(contactId) {

  };

  let removeInvite = function removeInvite(contactId) {

  };

  let sendProfile = function sendProfile(channelId, userInfo) {
    let channelInfo = state.cloud.channels.get([channelId, 'channelInfo']);

    let handleProfileAck = (ack) => {
      return buffer.removeProfile(channelInfo.id, userInfo.version);
    };

    return network.sendProfile(channelInfo, userInfo)
      .then(handleProfileAck);
  };

  let addProfile = function addProfile(channelId) {
    let userInfo = state.cloud.identity.get(['userInfo']);
    let profileVersion = userInfo.version;
    let existingBufferedProfile = sendAttempts.profiles[channelId];

    if (existingBufferedProfile.version >= profileVersion) {
      return $q.when();
    }

    sendProfile(channelId, userInfo);
    sendAttempts.profiles[channelId] =
      $interval(() => sendProfile(channelId, userInfo), 20000);

    return state.save(
      bufferedProfilesCursor,
      [channelId],
      {channelId, profileVersion}
    );
  };

  let removeProfile = function removeProfile(channelId, profileVersion) {
    let existingBufferedProfile = sendAttempts.profiles[channelId];

    if (existingBufferedProfile.version < profileVersion) {
      return $q.when();
    }

    $interval.cancel(sendAttempts.profiles[channelId]);
    sendAttempts.profiles[channelId] = undefined;

    return state.remove(bufferedProfilesCursor, [channelId]);
  };

  let initialize = function initialize(networkService) {
    network = networkService;

    let bufferedMessagesCursor = state.cloud.buffer.select(['messages']);
    let bufferedMessage = bufferedMessagesCursor.get();

    sendAttempts.messages = R.mapObj((messageBuffer) => {
      let channelId = messageBuffer.channelId;
      let messageId = messageBuffer.messageId;

      //TODO: stagger the initial send and retry intervals
      sendMessage(messageId, channelId);
      return $interval(() => sendMessage(messageId, channelId), 20000);
    })(bufferedMessage);

    return $q.when();
  };

  return {
    addMessage,
    removeMessage,
    initialize
  };
}
