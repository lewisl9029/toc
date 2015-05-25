import template from './cloud-connect-form.html!text';

export default function tocCloudConnectForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'cloudConnectForm',
    controller: function CloudConnectFormController($ionicHistory) {
      this.goBack = function goBack() {
        $ionicHistory.goBack(1);
      };

      this.selectedService = 'remotestorage';

      this.services = {
        'remotestorage': {
          id: 'remotestorage',
          name: 'remoteStorage',
          description: 'Use remoteStorage to store your data.',
          img: 'remotestorage.svg',
          connect: function connectRemotestorage() {

          }
        },
        'dropbox': {
          id: 'dropbox',
          name: 'Dropbox',
          description: 'Use Dropbox to store your data.',
          img: 'dropbox.svg',
          connect: function connectDropbox() {

          }
        },
        'googledrive': {
          id: 'googledrive',
          name: 'Google Drive',
          description: 'Use Google Drive to store your data.',
          img: 'googledrive.svg',
          connect: function connectGoogledrive() {

          }
        }
      };

      this.serviceList = [
        this.services['remotestorage'],
        this.services['dropbox'],
        this.services['googledrive']
      ];
    }
  };
}
