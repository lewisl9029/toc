export let serviceName = 'buffer';
export default /*@ngInject*/ function buffer(
  state
) {
  let PAYLOAD_TYPES = {
    message: 'message',
    profile: 'profile'
  };

  let addMessage = function addMessage(channelId, messageId) {

  };

  //send all messages in buffer
  //call immediately if status is 1, otherwise set up listener for status
  let flush = function flush() {

  };

  let initialize = function initialize() {
    let messagesCursor = state.cloud.buffer;
    
    R.forEach((channelId) => {
      let messageChannelCursor = messagesCursor.select(channelId);

      let startSendingMessage =

      state.addListener(messageChannelCursor, )
    })(R.keys(messagesCursor.get()));

    R.pipe(
      R.map
    )(messageChannels);
  };

  return {
    add
  };
}
