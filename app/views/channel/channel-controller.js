export let controllerName = 'ChannelController';
export default /*@ngInject*/ function ChannelController(
  $q,
  $scope,
  $stateParams,
  identity,
  network,
  notification,
  state
) {
  this.getAvatar = identity.getAvatar;
  this.channelId = $stateParams.channelId;

  let channelCursor = state.cloud.channels
    .select([this.channelId]);

  let contactCursor = state.cloud.contacts;

  this.contact = contactCursor.get(
    channelCursor.get(['channelInfo', 'contactIds'])[0]
  );
  let updateTitle = () => {
    this.title = this.contact.userInfo.displayName;
  };

  state.addListener(contactCursor, updateTitle, $scope);

  let updateContact = () => {
    this.contact = contactCursor.get(
      //TODO: refactor data dependency between contacts and channels
      channelCursor.get(['channelInfo', 'contactIds'])[0]
    );
  };

  state.addListener(contactCursor, updateContact, $scope);
  state.addListener(channelCursor, updateContact, $scope, {
    skipInitialize: true
  });

  this.message = '';
  //TODO: add to offline message queue instead of blocking further input
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
}
