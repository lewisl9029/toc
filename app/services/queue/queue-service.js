export let serviceName = 'queue';
export default /*@ngInject*/ function queue(
  state
) {
  let PAYLOAD_TYPES = {
    message: 'message',
    profile: 'profile'
  };

  let enqueue = function enqueue(channelId, payloadType, payload) {
    
  };

  let dequeue = function dequeue() {

  };

  return {
    enqueue,
    dequeue
  };
}
