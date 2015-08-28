import template from './password-prompt-modal.html!text';

export let directiveName = 'tocPasswordPromptModal';
export default /*@ngInject*/ function tocPasswordPromptModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      removeModal: '&'
    },
    controllerAs: 'passwordPromptModal',
    controller: /*@ngInject*/ function PasswordPromptModalController(
      $scope,
      session,
      state
    ) {
      this.removeModal = $scope.removeModal;
      this.staySignedIn = true;

      this.signUp = function signUp() {
        return session.signUp();
      };
    }
  };
}
