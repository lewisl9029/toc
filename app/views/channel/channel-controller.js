export let controllerName = 'ChannelController';
export default /*@ngInject*/ function ChannelController(
  $stateParams,
  $ionicScrollDelegate
) {
  this.channelId = $stateParams.channelId;

  this.viewLatest = () => {
    // FIXME: this actually scrolls ALL scroll views to bottom
    // select a specific delegate instance using something similar to
    // the approach in tocMessageList
    $ionicScrollDelegate.scrollBottom(true);
  };
}
