export let controllerName = 'WelcomeController';
export default /*@ngInject*/ function WelcomeController(
  $ionicModal,
  $scope,
  R,
  state,
  session,
  storage
) {
  session.preparePublic()
    .then(() => {
      this.openPasswordPromptModal = function openPasswordPromptModal() {
        this.passwordPromptModal = $ionicModal.fromTemplate(
          `
          <toc-password-prompt-modal class="toc-modal-container"
            remove-modal="welcomeView.passwordPromptModal.remove()">
          </toc-password-prompt-modal>
          `,
          {
            scope: $scope,
            backdropClickToClose: false,
            hardwareBackButtonToClose: false
          }
        );

        this.passwordPromptModal.show();
      };

      this.openPasswordPromptModal();
    });
}
