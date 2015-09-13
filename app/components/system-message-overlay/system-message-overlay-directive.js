import template from './system-message-overlay.html!text';

export let directiveName = 'tocSystemMessageOverlay';
export default /*@ngInject*/ function tocSystemMessageOverlay() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'systemMessageOverlay',
    controller: /*@ngInject*/ function SystemMessageOverlayController(
      $scope,
      $timeout,
      $q,
      identity,
      navigation,
      notifications,
      state,
      R
    ) {
    }
  };
}
