import angular from 'angular';

import 'angular-toastr';

export default angular.module('toc.libraries.angular-toastr', ['toastr'])
  .config((toastrConfig) => {
    angular.extend(toastrConfig, {
      allowHtml: false,
      closeButton: false,
      closeHtml: '<button><i class="icon ion-close"></i></button>',
      containerId: 'toast-container',
      extendedTimeOut: 1000,
      iconClasses: {
        error: 'toast-error ion-close-circled',
        info: 'toast-info ion-ios-information',
        success: 'toast-success ion-checkmark-circled',
        warning: 'toast-warning ion-android-warning'
      },
      maxOpened: 0,
      messageClass: 'toast-message',
      newestOnTop: true,
      onHidden: null,
      onShown: null,
      positionClass: 'toast-top-right',
      tapToDismiss: true,
      target: 'body',
      timeOut: 5000,
      titleClass: 'toast-title',
      toastClass: 'toast'
    });
  })
  .factory('angularToastr', (toastr) => toastr);