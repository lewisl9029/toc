export let serviceName = 'buffer';
export default /*@ngInject*/ function buffer(
  state
) {
  let PAYLOAD_TYPES = {
    message: 'message',
    profile: 'profile'
  };

  let add = function add(contactId, channelId, payloadType, payload) {
    
  };

  //send all messages in buffer
  //call immediately if status is 1, otherwise set up listener for status
  let flush = function flush() {

  };

  return {
    add
  };
}
