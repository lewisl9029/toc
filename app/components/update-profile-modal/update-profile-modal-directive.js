import template from './update-profile-modal.html!text';

export let directiveName = 'tocUpdateProfileModal';
export default /*@ngInject*/ function tocUpdateProfileModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      removeModal: '&'
    },
    controllerAs: 'updateProfileModal',
    controller: /*@ngInject*/ function UpdateProfileModalController(
      $scope
    ) {
      this.removeModal = $scope.removeModal;
    }
  };
}
