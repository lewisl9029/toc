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
      storage
    ) {
      this.removeModal = $scope.removeModal;
      this.selectedService = 'remotestorage';
      this.userExists = identity.getUserExists();

      this.remoteStorageEmail = '';

      this.submitRemoteStorageEmail = () => {
        if (!this.remoteStorageEmail) {
          //validation is already done by angular form's email input
          // email will be undefined if it didn't pass validation
          return;
        }

        if (this.userExists) {
          return $ionicPopup.confirm({
              title: 'Preparing to Upload Data',
              template: `
                <p>Toc will try to upload your local data into this cloud account.</p>
                <p>Please confirm this cloud account hasn't been used with Toc before.</p>
              `,
              cancelType: 'button-outline button-calm',
              okText: 'Confirm',
              okType: 'button-outline button-assertive'
            })
            .then((response) => {
              if (!response) {
                return;
              }
              storage.connect(this.remoteStorageEmail);
            });
        }

        storage.connect(this.remoteStorageEmail);
      };

      this.services = {
        'remotestorage': {
          id: 'remotestorage',
          name: 'remoteStorage',
          description: 'An open protocol for web storage.',
          img: 'remotestorage.svg',
          connect: () => {
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
                  type: 'button-outline button-calm'
                },
                {
                  text: 'Connect',
                  type: 'button-outline button-balanced',
                  onTap: (event) => {
                    if (!this.remoteStorageEmail) {
                      event.preventDefault();
                      return;
                    }

                    this.submitRemoteStorageEmail();
                  }
                }
              ]
            });
          }
        },
        'dropbox': {
          id: 'dropbox',
          name: 'Dropbox',
          description: '(Coming soon)',
          img: 'dropbox.svg',
          connect: function connectDropbox() {

          }
        },
        'googledrive': {
          id: 'googledrive',
          name: 'Google Drive',
          description: '(Coming soon)',
          img: 'googledrive.svg',
          connect: function connectGoogledrive() {

          }
        }
      };

      this.connect = () => {
        this.services[this.selectedService].connect();
      }
    }
  };
}
