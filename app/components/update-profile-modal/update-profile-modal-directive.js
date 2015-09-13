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
      $log,
      contacts,
      identity,
      state,
      R
    ) {
      this.removeModal = $scope.removeModal;
      let userInfo = state.cloud.identity.get(['userInfo']);
      this.userInfo = R.assoc('version', userInfo.version + 1, userInfo);

      this.getNewAvatar = function getNewAvatar() {
        return identity.getAvatar(this.userInfo);
      };

      this.updateProfile = function updateProfile(updateProfileForm) {
        if (updateProfileForm.$invalid) {
          if (updateProfileForm.$error.email) {
            return notifications.notifySystem('Please enter a valid email.');
          }

          return notifications.notifyGenericError(updateProfileForm.$error);
        }

        return state.save(
            state.cloud.identity,
            ['userInfo'],
            this.userInfo
          )
          .then(() => contacts.saveProfileUpdates())
          .then(() => {
            this.removeModal();
            return $q.when();
          })
          .catch(notifications.notifyGenericError);
      };
    }
  };
}
