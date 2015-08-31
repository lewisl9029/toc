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
      $scope,
      $q,
      identity,
      state
    ) {
      this.removeModal = $scope.removeModal;

      this.userInfo = state.cloud.identity.get(['userInfo']);

      this.getNewAvatar = function getNewAvatar() {
        return identity.getAvatar(this.userInfo);
      };

      this.updateProfile = function updateProfile() {
        return state.save(
            state.cloud.identity,
            ['userInfo'],
            this.userInfo
          )
          .then(() => {
            this.removeModal();
            return $q.when();
          });
      };
    }
  };
}
