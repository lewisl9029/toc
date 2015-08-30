import template from './edit-profile-modal.html!text';

export let directiveName = 'tocEditProfileModal';
export default /*@ngInject*/ function tocEditProfileModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      removeModal: '&'
    },
    controllerAs: 'editProfileModal',
    controller: /*@ngInject*/ function EditProfileModalController(
    ) {
    }
  };
}
