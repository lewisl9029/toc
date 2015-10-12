import template from './password-prompt-modal.html!text';

export let directiveName = 'tocPasswordPromptModal';
export default /*@ngInject*/ function tocPasswordPromptModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      showModal: '&',
      hideModal: '&',
      removeModal: '&',
    },
    controllerAs: 'passwordPromptModal',
    controller: /*@ngInject*/ function PasswordPromptModalController(
      $scope,
      $ionicLoading,
      $ionicModal,
      $log,
      $timeout,
      $window,
      $q,
      session,
      navigation,
      notifications,
      identity,
      state
    ) {
      this.removeModal = $scope.removeModal;
      this.hideModal = $scope.hideModal;
      this.showModal = $scope.showModal;

      let userExistsCursor = state.cloudUnencrypted.cryptography;
      let updateUserExists = () => {
        this.userExists = userExistsCursor.get() !== undefined;
      };
      state.addListener(userExistsCursor, updateUserExists, $scope);

      let staySignedIn = state.local.session.get(['staySignedIn']);
      this.staySignedIn = staySignedIn === undefined ? true : staySignedIn;

      this.begin = function begin(passwordPromptForm) {
        if (passwordPromptForm.$invalid) {
          if (passwordPromptForm.$error.required &&
            passwordPromptForm.$error.required[1]) {
            return notifications.notifySystem('Please enter a password.');
          }
          if (passwordPromptForm.$error.equalTo) {
            return notifications.notifySystem(
              'Please ensure your passwords match.'
            );
          }
          if (passwordPromptForm.$error.required) {
            return notifications.notifySystem('Please enter a password.');
          }

          return notifications.notifyGenericError(passwordPromptForm.$error);
        }

        let updateStaySignedIn = () => staySignedIn === this.staySignedIn ?
          $q.when() :
          state.save(state.local.session, ['staySignedIn'], this.staySignedIn);

        $window.tocResumeLoadingAnimation();
        return this.hideModal()
          .then(() => session.start(
            { password: this.password },
            this.staySignedIn
          ))
          .then(() => this.removeModal())
          .catch((error) => {
            this.showModal()
              .then(() => $window.tocResumeLoadingAnimation());
            let showErrorMessage = () => {
              if (error === 'identity: wrong password') {
                return notifications.notifySystem(
                  'The password you entered was incorrect.'
                );
              }

              return notifications.notifyGenericError(error);
            };

            return $timeout(showErrorMessage, 1000, false);
          });
      };

      this.showCloudConnectModal = function showCloudConnectModal() {
        let modalTemplate = `
          <toc-cloud-connect-modal class="toc-modal-container"
            remove-modal="passwordPromptModal.cloudConnectModal.remove()">
          </toc-cloud-connect-modal>
        `;

        let modalName = 'cloudConnectModal';

        return navigation.showModal(modalName, modalTemplate, this, $scope);
      };
    }
  };
}
