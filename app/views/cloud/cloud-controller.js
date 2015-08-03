export let controllerName = 'CloudController';
export default /*@ngInject*/ function CloudController(
  storage
) {
  this.isConnected = storage.isConnected;
}
