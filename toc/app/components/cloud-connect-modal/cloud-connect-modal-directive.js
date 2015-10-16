import template from './cloud-connect-modal.html!text';

export let directiveName = 'tocCloudConnectModal';
export default /*@ngInject*/ function tocCloudConnectModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      removeModal: '&'
    },
    controllerAs: 'cloudConnectModal',
    controller: /*@ngInject*/ function CloudConnectModalController(
      $ionicPopup,
      $scope,
      identity,
      notifications,
      storage,
      state
    ) {
      this.removeModal = $scope.removeModal;
      this.selectedService = 'remotestorage';
      let userExistsCursor = state.cloudUnencrypted.cryptography;
      let updateUserExists = () => {
        this.userExists = userExistsCursor.get() !== undefined;
      };
      state.addListener(userExistsCursor, updateUserExists, $scope);

      this.remoteStorageEmail = '';

      this.services = storage.SERVICES;

      this.connect = () => {
        switch (this.selectedService) {
          case this.services.remotestorage.id:
            let remoteStoragePopup = $ionicPopup.show({
              template: `
                <form ng-submit="cloudConnectModal.submitRemoteStorageEmail()"
                  novalidate>
                  <input type="email" placeholder="Your remoteStorage email."
                    ng-model="cloudConnectModal.remoteStorageEmail" toc-auto-focus>
                </form>
                `,
              title: 'Connect remoteStorage',
              scope: $scope,
              buttons: [
                {
                  text: 'Cancel',
                  type: 'button-calm button-style'
                },
                {
                  text: 'Connect',
                  type: 'button-positive button-style',
                  onTap: (event) => {
                    this.submitRemoteStorageEmail(event);
                  }
                }
              ]
            });
            break;
          case this.services.dropbox.id:

            break;

          case this.services.googledrive.id:

            break;
        }
      };

      this.submitRemoteStorageEmail = (event) => {
        if (!this.remoteStorageEmail) {
          if (event) {
            event.preventDefault();
          }

          //validation is already done by angular form's email input
          // email will be undefined if it didn't pass validation
          return notifications.notifySystem(
            `Please enter a valid email.`
          );
        }
        let handleConnectionError = (error) => {
          return notifications.notifyGenericError(error);
        };

        let connectOptions = {
          serviceId: this.services.remotestorage.id,
          email: this.remoteStorageEmail
        };

        if (this.userExists) {
          return $ionicPopup.confirm({
              title: 'Preparing to Upload Data',
              template: `
                <p>Toc will try to upload your local data into this cloud account.</p>
                <p>Please confirm this cloud account hasn't been used with Toc before.</p>
              `,
              cancelType: 'button-calm button-style',
              okText: 'Confirm',
              okType: 'button-assertive button-style'
            })
            .then((response) => {
              if (!response) {
                return;
              }
              storage.connect(connectOptions)
                .catch(handleConnectionError);
            });
        }

        storage.connect(connectOptions)
          .catch(handleConnectionError);
      };
    }
  };
}
