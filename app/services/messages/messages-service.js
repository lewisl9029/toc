export let serviceName = 'messages';
export default /*@ngInject*/ function messages(
  $q,
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

    let userId = state.cloud.identity.get(['userInfo', 'id']);
    let logicalClock = state.cloud.channels.get([channelId, 'logicalClock']);
    let newLogicalClock = logicalClock + 1;
    let sentTime = time.getTime();
    let contactIds = state.cloud.channels.get([channelId, 'contactIds']);

    let messageId = `${sentTime}-${userId}`;

    let messageInfo = {
      id: messageId,
      senderId: userId,
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

    let addToMessageBuffer = () => $q.all(R.map((contactId) => state.save(
      state.cloud.buffer,
      ['messages', contactId, messageId],
      { messageId, channelId, contactId }
    ))(contactIds));

    return bumpLogicalClock()
      .then(saveMessageInfo)
      .then(addToMessageBuffer);
  };

  return {
    saveSendingMessage
  };
}
