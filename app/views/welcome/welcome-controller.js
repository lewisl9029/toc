export let controllerName = 'WelcomeController';
export default /*@ngInject*/ function WelcomeController(
  $ionicModal,
  $scope,
  R,
  state,
  session,
  storage
) {
  session.prepare()
    .then(() => {
      this.passwordPromptModal = $ionicModal.fromTemplate(
        `
        <toc-password-prompt-modal class="toc-modal-container"
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
    });
}
