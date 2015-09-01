export let serviceName = 'messages';
export default /*@ngInject*/ function messages(
  $q,
  buffer,
  cryptography,
  time,
  state,
  notifications,
  R
) {
  let saveReceivedMessage = function saveReceivedMessage(
    messagePayload, messageMetadata
  ) {
    let messageContent = messagePayload.c;
    let receivedLogicalClock = messagePayload.l;
    let sentTime = messageMetadata.sentTime;
    let receivedTime = messageMetadata.receivedTime;
    let senderId = messageMetadata.senderId;
    let channelId = messageMetadata.channelId;

    let messageIdBase = cryptography.getSha256(`${channelId}-${senderId}`)
      .substr(0, 32);

    let messageId = `${sentTime}-${messageIdBase}`;

    let messageInfo = {
      id: messageId,
      //TODO: find main contact endpoint id from sender userId
      // when using multi-endpoint contacts
      senderId: senderId,
      sentTime: sentTime,
      logicalClock: receivedLogicalClock,
      content: messageContent
    };

    let channelCursor = state.cloud.channels.select([channelId]);

    let messagesCursor = state.cloud.messages.select([channelId]);

    let existingLogicalClock = channelCursor.get('logicalClock');

    let currentLogicalClock = receivedLogicalClock >= existingLogicalClock ?
      receivedLogicalClock : existingLogicalClock;

    return state.save(
        channelCursor,
        ['logicalClock'],
        currentLogicalClock + 1
      )
      .then(() => state.save(
        messagesCursor,
        [messageId, 'messageInfo'],
        messageInfo
      ))
      .then(() => state.save(
        messagesCursor,
        [messageId, 'receivedTime'],
        receivedTime
      ))
      .then(() => state.save(
        channelCursor,
        ['latestMessageId'],
        messageId
      ))
      .then(() => {
        let activeViewId =
          state.cloud.navigation.get(['activeViewId']);
        if (activeViewId === channelId &&
          channelCursor.get(['viewingLatest'])) {
          return $q.when();
        }

        let updatingUnreadPointer =
          !channelCursor.get(['unreadMessageId']) ?
            state.save(
              channelCursor,
              ['unreadMessageId'],
              messageId
            ) :
            $q.when();

        return updatingUnreadPointer
          .then(() => notifications.notify(channelId));
      });
  };

  let saveSendingMessage = function saveSendingMessage(
    channelId, messageContent
  ) {
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
      [channelId, messageId, 'messageInfo'],
      messageInfo
    );

    return bumpLogicalClock()
      .then(saveMessageInfo)
      .then(() => buffer.addMessage(messageId, channelId));
  };

  return {
    saveSendingMessage,
    saveReceivedMessage
  };
}
