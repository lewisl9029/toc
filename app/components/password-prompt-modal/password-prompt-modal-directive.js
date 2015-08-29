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
      $q,
      session,
      state
    ) {
      this.removeModal = $scope.removeModal;

      this.userExists = state.cloudUnencrypted.cryptography.get() !== undefined;

      let staySignedIn = state.local.session.get(['staySignedIn']);
      this.staySignedIn = staySignedIn === undefined ? true : staySignedIn;

      this.signUp = function signUp() {
        let updateStaySignedIn = () => staySignedIn === this.staySignedIn ?
          $q.when() :
          state.save(state.local.session, ['staySignedIn'], this.staySignedIn);

        return updateStaySignedIn()
          .then(() => session.start(
            { password: this.password },
            this.staySignedIn
          ));
      };
    }
  };
}
