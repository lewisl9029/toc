export let controllerName = 'WelcomeController';
export default /*@ngInject*/ function WelcomeController(
  $ionicModal,
  $scope,
  R,
  state,
  storage
) {
  this.passwordPromptModal = $ionicModal.fromTemplate(
    `
    <toc-password-prompt-modal
      remove-modal="welcomeView.passwordPromptModal.hide()">
    </toc-password-prompt-modal>
    `,
    {
      scope: $scope,
      backdropClickToClose: false,
      hardwareBackButtonToClose: false
    }
  );

  this.openPasswordPromptModal = function openPasswordPromptModal() {
    this.passwordPromptModal.show();
  };

  this.openPasswordPromptModal();

  $scope.$on('$stateChangeStart', () => this.passwordPromptModal.remove());
}
