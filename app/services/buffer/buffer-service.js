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

  let addMessage = function addMessage(messageId, channelId) {
    if (sendAttempts.messages[messageId]) {
      return;
    }

    return state.save(
        state.cloud.buffer,
        ['messages', messageId],
        { messageId, channelId }
      )
      .then(() => {
        network.sendMessage(channelId, messageId);
        sendAttempts.messages[messageId] =
          $interval(() => network.sendMessage(channelId, messageId), 20000);
      });
  };

  let removeMessage = function removeMessage(messageId) {
    if (!sendAttempts.messages[messageId]) {
      return;
    }

    return state.remove(
        state.cloud.buffer,
        ['messages', messageId]
      )
      .then(() => {
        $interval.cancel(sendAttempts.messages[messageId]);
        sendAttempts.messages[messageId] = undefined;
      });
  };

  let addInvite = function addInvite(contactId) {

  };

  let removeInvite = function removeInvite(contactId) {

  };

  let addProfile = function addProfile(channelId) {
    if (sendAttempts.profiles[channelId]) {
      return;
    }

    return state.save(
        state.cloud.buffer,
        ['profiles', channelId],
        {channelId}
      )
      .then(() => {
        network.sendProfile(channelId);
        sendAttempts.profiles[channelId] =
          $interval(() => network.sendProfile(channelId), 20000);
      });
  };

  let removeProfile = function removeProfile(channelId) {
    if (!sendAttempts.profiles[channelId]) {
      return;
    }

    return state.remove(
        state.cloud.buffer,
        ['profiles', channelId]
      )
      .then(() => {
        $interval.cancel(sendAttempts.profiles[channelId]);
        sendAttempts.profiles[channelId] = undefined;
      });
  };

  let initialize = function initialize(networkService) {
    network = networkService;

    let bufferedMessagesCursor = state.cloud.buffer.select(['messages']);
    let bufferedMessage = bufferedMessagesCursor.get();

    sendAttempts.messages = R.mapObj((messageBuffer) => {
      let channelId = messageBuffer.channelId;
      let messageId = messageBuffer.messageId;

      //TODO: stagger the initial send and retry intervals
      network.sendMessage(channelId, messageId);
      return $interval(() => network.sendMessage(channelId, messageId), 20000);
    })(bufferedMessage);

    return $q.when();
  };

  return {
    addMessage,
    removeMessage,
    initialize
  };
}
