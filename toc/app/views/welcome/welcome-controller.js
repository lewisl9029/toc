export let controllerName = 'WelcomeController';
export default /*@ngInject*/ function WelcomeController(
  $ionicModal,
  $window,
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
            remove-modal="welcomeView.passwordPromptModal.remove()"
            show-modal="welcomeView.passwordPromptModal.show()"
            hide-modal="welcomeView.passwordPromptModal.hide()">
          </toc-password-prompt-modal>
          `,
          {
            scope: $scope,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
          }
        );

        this.passwordPromptModal.show()
          .then(() => {
            $window.tocPauseLoadingAnimation();
          });
      };

      this.openPasswordPromptModal();
    });
}
