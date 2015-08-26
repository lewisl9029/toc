import template from './cloud-connect-form.html!text';

export let directiveName = 'tocCloudConnectForm';
export default /*@ngInject*/ function tocCloudConnectForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'cloudConnectForm',
    controller: /*@ngInject*/ function CloudConnectFormController(
      $ionicHistory,
      $ionicPopup,
      $scope,
      storage
    ) {
      this.goBack = function goBack() {
        $ionicHistory.goBack();
      };

      this.selectedService = 'remotestorage';

      $scope.remoteStorage = {
        email: ''
      };

      $scope.submitRemoteStorageEmail = (email) => {
        if (!email) {
          //TODO: actually do validation here
          // return notification.error('Please enter a valid email.', 'Validation Error');
        }

        storage.connect(email);
      };

      this.services = {
        'remotestorage': {
          id: 'remotestorage',
          name: 'remoteStorage',
          description: 'Use remoteStorage to store your data.',
          img: 'remotestorage.svg',
          connect: () => {
            let remoteStoragePopup = $ionicPopup.show({
              template: `
                <form ng-submit="submitRemoteStorageEmail(remoteStorage.email)"
                  novalidate>
                  <input type="email" placeholder="Your remoteStorage email."
                    ng-model="remoteStorage.email" toc-auto-focus>
                </form>`,
              title: 'RemoteStorage Email',
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
                    if (!$scope.remoteStorage.email) {
                      event.preventDefault();
                    }

                    $scope.submitRemoteStorageEmail($scope.remoteStorage.email);
                  }
                }
              ]
            });
          }
        },
        'dropbox': {
          id: 'dropbox',
          name: 'Dropbox',
          description: '(Coming soon) Use Dropbox to store your data.',
          img: 'dropbox.svg',
          connect: function connectDropbox() {

          }
        },
        'googledrive': {
          id: 'googledrive',
          name: 'Google Drive',
          description: '(Coming soon) Use Google Drive to store your data.',
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
