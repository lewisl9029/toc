export let serviceName = 'messages';
export default /*@ngInject*/ function messages(
  $q,
  $log,
  buffer,
  cryptography,
  time,
  state,
  notifications,
  R
) {
  let compareMessages = function compareMessages(message1, message2) {
    let logicalClockDiff =
      message1.messageInfo.logicalClock -
      message2.messageInfo.logicalClock;

    if (logicalClockDiff === 0) {
      //tiebreaker
      //id is in format sentTime-(hash(channelId-senderId))
      return message1.messageInfo.id > message2.messageInfo.id ? 1 : -1;
    }

    // >1 message1 is later
    // <1 message1 is earlier
    return logicalClockDiff;
  };

  let saveReceivedMessage = function saveReceivedMessage(
    messagePayload, messageMetadata
  ) {
    let sentTime = messageMetadata.sentTime;
    let senderId = messageMetadata.senderId;
    let channelId = messageMetadata.channelId;

    let messageIdBase = cryptography.getSha256(`${channelId}-${senderId}`)
      .substr(0, 32);
    let messageId = `${sentTime}-${messageIdBase}`;

    let existingMessage = state.cloud.messages.get([channelId, messageId]);
    if (existingMessage) {
      return $q.when();
    }

    let receivedTime = messageMetadata.receivedTime;
    let messageContent = messagePayload.c;
    let receivedLogicalClock = messagePayload.l;

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
    let messageCursor = messagesCursor.select([messageId]);
    let existingLogicalClock = channelCursor.get('logicalClock');

    let currentLogicalClock = receivedLogicalClock >= existingLogicalClock ?
      receivedLogicalClock : existingLogicalClock;

    let newLogicalClock = currentLogicalClock + 1;

    let updateLatestMessageId = () => {
      let latestMessageId = channelCursor.get(['latestMessageId']);
      let latestMessage = messagesCursor.get([latestMessageId]);
      let message = {messageInfo};

      //do nothing if message is earlier than latest message
      if (compareMessages(message, latestMessage) < 0) {
        return $q.when();
      }

      return state.save(channelCursor, ['latestMessageId'], messageId);
    };

    let notifyMessage = () => {
      //dont notify or update unread pointer if viewing latest message
      let activeViewId = state.cloud.navigation.get(['activeViewId']);
      if (activeViewId === channelId && channelCursor.get(['viewingLatest'])) {
        return $q.when();
      }

      let updateUnreadPointer = () => {
        let unreadMessageId = channelCursor.get(['unreadMessageId']);
        if (!unreadMessageId) {
          return $q.when();
        }

        let unreadMessage = messagesCursor.get([unreadMessageId]);
        let message = {messageInfo};

        //do nothing if message is later than unread message
        if (compareMessages(message, unreadMessage) > 0) {
          return $q.when();
        }

        return state.save(channelCursor, ['latestMessageId'], messageId);
      }

      return updateUnreadPointer()
        .then(() => notifications.notify(channelId));
    };

    return state.save(channelCursor, ['logicalClock'], newLogicalClock)
      .then(() => state.save(messageCursor, ['messageInfo'], messageInfo))
      .then(() => state.save(messageCursor, ['receivedTime'], receivedTime))
      .then(updateLatestMessageId)
      .then(notifyMessage)
      .catch($log.error);
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
      .then(() => buffer.addMessage(messageId, channelId))
      .catch($log.error);
  };

  return {
    compareMessages,
    saveSendingMessage,
    saveReceivedMessage
  };
}
