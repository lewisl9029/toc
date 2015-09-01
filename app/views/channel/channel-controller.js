export let controllerName = 'ChannelController';
export default /*@ngInject*/ function ChannelController(
  $q,
  $scope,
  $stateParams,
  $ionicScrollDelegate,
  identity,
  network,
  messages,
  state
) {
  this.channelId = $stateParams.channelId;

  let channelCursor = state.cloud.channels.select([this.channelId]);
  let contactCursor = state.cloud.contacts;

  let updateContact = () => {
    this.contact = contactCursor.get(
      this.channel.channelInfo.contactIds[0]
    );
  };

  let updateChannel = () => {
    this.channel = channelCursor.get();
    updateContact();
  };

  state.addListener(channelCursor, updateChannel, $scope);
  state.addListener(contactCursor, updateContact, $scope);

  this.viewLatest = () => {
    $ionicScrollDelegate.$getByHandle(this.channelId).scrollBottom(true);
  };

  this.message = '';

  this.send = () => {
    let message = this.message;
    this.message = '';

    return messages.saveSendingMessage(this.channelId, message);
  };

  //TODO: add to offline message queue instead of blocking further input
  // this.send = () => {
  //   const MAX_ATTEMPTS = 3;
  //   let attemptCount = 0;
  //   let recursivelySendMessage = () => {
  //     let logicalClock = channelCursor.get(['logicalClock']);
  //
  //     return network.sendMessage(
  //         channelCursor.get(['channelInfo']),
  //         this.message,
  //         logicalClock + 1
  //       )
  //       .then(() => {
  //         let currentLogicalClock = channelCursor
  //           .get(['logicalClock']);
  //
  //         return state.save(
  //           channelCursor,
  //           ['logicalClock'],
  //           currentLogicalClock + 1
  //         );
  //       })
  //       .catch((error) => {
  //         if (error !== 'timeout') {
  //           return $q.reject(error);
  //         }
  //
  //         attemptCount++;
  //         if (attemptCount === MAX_ATTEMPTS) {
  //           return $q.reject('Message sending has timed out.');
  //         }
  //
  //         return recursivelySendMessage();
  //       });
  //   };
  //
  //   this.sending = recursivelySendMessage()
  //     .then(() => {
  //       this.message = '';
  //       return $q.when();
  //     });
  //
  //   return this.sending;
  // };
}
