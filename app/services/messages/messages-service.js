export let serviceName = 'messages';
export default /*@ngInject*/ function messages(
  $q,
  buffer,
  cryptography,
  network,
  time,
  state,
  R
) {
  let saveReceivedMessage = saveReceivedMessage() {

  };

  let saveSendingMessage = saveSendingMessage(channelId, messageContent) {
    if (!messageContent) {
      return $q.reject('messages: message must not be empty');
    }

    let senderId = state.cloud.identity.get(['userInfo', 'id']);
    let logicalClock = state.cloud.channels.get([channelId, 'logicalClock']);
    let newLogicalClock = logicalClock + 1;
    let sentTime = time.getTime();

    let messageIdBase = cryptography.getSha256(`${channelId}-${senderId}`)
      .substr(0, 32);

    let messageId = `${sentTime}-${messageIdBase}`;

    let messageInfo = {
      id: messageId,
      senderId: senderId,
      sentTime: sentTime,
      logicalClock: newLogicalClock,
      content: messageContent
    };

    let bumpLogicalClock = () => state.save(
      state.cloud.channels,
      [channelId, 'logicalClock'],
      newLogicalClock
    );

    let saveMessageInfo = () => state.save(
      state.cloud.messages,
      [channelId, 'messageInfo'],
      messageInfo
    );

    return bumpLogicalClock()
      .then(saveMessageInfo)
      .then(() => buffer.addMessage(messageId, channelId));
  };

  return {
    saveSendingMessage
  };
}
