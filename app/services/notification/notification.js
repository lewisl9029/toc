import angular from 'angular';

import angularToastr from 'libraries/angular-toastr/angular-toastr';

import state from 'services/state/state';

import service from './notification-service';

export default angular.module('toc.services.notification', [
    angularToastr.name,
    state.name
  ])
  .factory(service.name, service);
