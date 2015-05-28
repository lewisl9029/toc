export default function ChannelController($q, $stateParams, state, network,
  notification) {
  this.channelId = $stateParams.channelId;

  let channelCursor = state.cloud.cursors.network
    .select(['channels', this.channelId]);

  let contactCursor = state.cloud.cursors.contacts;

  this.contact = contactCursor.get(
    channelCursor.get(['channelInfo', 'contactIds'])[0]
  );

  this.title = this.contact.userInfo.displayName;

  this.message = '';
  this.send = () => {
    const MAX_ATTEMPTS = 3;
    let attemptCount = 0;
    let recursivelySendMessage = () => {
      let logicalClock = channelCursor.get(['logicalClock']);

      return network.sendMessage(
          channelCursor.get(['channelInfo']),
          this.message,
          logicalClock + 1
        )
        .then(() => {
          let currentLogicalClock = channelCursor
            .get(['logicalClock']);

          return state.save(
            channelCursor,
            ['logicalClock'],
            currentLogicalClock + 1
          );
        })
        .catch((error) => {
          if (error !== 'timeout') {
            return $q.reject(error);
          }

          attemptCount++;
          if (attemptCount === MAX_ATTEMPTS) {
            return $q.reject('Message sending has timed out.');
          }

          return recursivelySendMessage();
        });
    };

    this.sending = recursivelySendMessage()
      .then(() => {
        this.message = '';
        return $q.when();
      })
      .catch((error) => notification.error(error, 'Message Delivery Error'));

    return this.sending;
  };

  contactCursor.on('update', () => {
    this.contact = contactCursor.get(
      channelCursor.get(['channelInfo', 'contactIds'])[0]
    );
  });
}
