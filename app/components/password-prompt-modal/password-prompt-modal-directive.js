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
      $ionicLoading,
      $timeout,
      $q,
      session,
      state
    ) {
      this.removeModal = $scope.removeModal;

      this.userExists = state.cloudUnencrypted.cryptography.get() !== undefined;

      let staySignedIn = state.local.session.get(['staySignedIn']);
      this.staySignedIn = staySignedIn === undefined ? true : staySignedIn;

      this.signUp = function signUp() {
        // $ionicLoading.show();

        let updateStaySignedIn = () => staySignedIn === this.staySignedIn ?
          $q.when() :
          state.save(state.local.session, ['staySignedIn'], this.staySignedIn);

        return updateStaySignedIn()
          .then(() => session.start(
            { password: this.password },
            this.staySignedIn
          ))
          .then(() => $timeout(() => this.removeModal(), 1000));
          // .then(() => $ionicLoading.hide());
      };
    }
  };
}
