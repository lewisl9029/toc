import template from './about-toc-modal.html!text';

export let directiveName = 'tocAboutTocModal';
export default /*@ngInject*/ function tocAboutTocModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      removeModal: '&'
    },
    controllerAs: 'aboutTocModal',
    controller: /*@ngInject*/ function AboutTocModalController(
      $scope,
      $window,
      navigation
    ) {
      this.removeModal = $scope.removeModal;
      this.openWindow = navigation.openWindow;

      this.tocVersion = $window.tocVersion;
    }
  };
}
