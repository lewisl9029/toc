import angular from 'angular';

import angularToastr from 'libraries/angular-toastr/angular-toastr';

import state from 'services/state/state';

import service from './notification-service';

export default angular.module('toc.services.notification', [
    angularToastr.name,
    state.name
  ])
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
      newestOnTop: false,
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
  .factory(service.name, service);
