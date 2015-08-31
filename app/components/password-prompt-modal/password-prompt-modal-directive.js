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
      $ionicModal,
      $log,
      $timeout,
      $q,
      session,
      identity,
      state
    ) {
      this.removeModal = $scope.removeModal;

      this.userExists = identity.getUserExists();

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
          //modal doesnt animate out if removed immediately
          .then(() => $timeout(() => this.removeModal(), 1000))
          .catch($log.error);
          // .then(() => $ionicLoading.hide());
      };

      this.showCloudConnectModal = function showCloudConnectModal() {
        this.cloudConnectModal = $ionicModal.fromTemplate(
          `
          <toc-cloud-connect-modal class="toc-modal-container"
            remove-modal="passwordPromptModal.cloudConnectModal.remove()">
          </toc-cloud-connect-modal>
          `,
          { scope: $scope }
        );

        this.cloudConnectModal.show();
      };
    }
  };
}
