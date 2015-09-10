export let controllerName = 'ChannelController';
export default /*@ngInject*/ function ChannelController(
  $stateParams,
  $ionicScrollDelegate
) {
  this.channelId = $stateParams.channelId;

  this.viewLatest = () => {
    $ionicScrollDelegate.scrollBottom(true);
  };
}
