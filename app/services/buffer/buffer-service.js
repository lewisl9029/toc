export let serviceName = 'buffer';
export default /*@ngInject*/ function buffer(
  $interval,
  state
) {
  let network;

  let sendAttempts = {
    messages: undefined,
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

  let initialize = function initialize(networkService) {
    network = networkService;

    let messageBuffersCursor = state.cloud.buffer.select(['messages']);
    let messageBuffers = messageBuffersCursor.get();

    sendAttempts.messages = R.mapObj((messageBuffer) => {
      let channelId = messageBuffer.channelId;
      let messageId = messageBuffer.messageId;

      network.sendMessage(channelId, messageId);
      return $interval(() => network.sendMessage(channelId, messageId), 20000);
    })(messageBuffers);
  };

  return {
    addMessage,
    removeMessage,
    initialize
  };
}
