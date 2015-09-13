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

      this.userExists = identity.getUserExists();

      let staySignedIn = state.local.session.get(['staySignedIn']);
      this.staySignedIn = staySignedIn === undefined ? true : staySignedIn;

      this.begin = function begin(passwordPromptForm) {
        // $ionicLoading.show();
        if (passwordPromptForm.$invalid) {
          if (passwordPromptForm.$error.required[1]) {
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

          return notifications.notifyGenericError();
        }

        let updateStaySignedIn = () => staySignedIn === this.staySignedIn ?
          $q.when() :
          state.save(state.local.session, ['staySignedIn'], this.staySignedIn);

        this.hideModal();
        //modal doesn't animate out before starting login process without delay
        return $timeout(() => updateStaySignedIn(), 1000, false)
          .then(() => session.start(
            { password: this.password },
            this.staySignedIn
          ))
          //modal doesnt animate out if removed immediately
          .then(() => $timeout(() => this.removeModal(), 1000, false))
          .catch((error) => {
            $log.error(error);
            this.showModal();
            let showErrorMessage = () => {
              if (error === 'identity: wrong password') {
                return notifications.notifySystem(
                  'The password you entered was incorrect.'
                );
              }

              return notifications.notifyGenericError();
            };

            return $timeout(showErrorMessage, 1000, false);
          });
          // .then(() => $ionicLoading.hide());
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
