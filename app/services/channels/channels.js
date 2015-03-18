import angular from 'angular';

import state from 'services/state/state';

import service from './channels-service';

export default angular.module('toc.services.channels', [
    state.name
  ])
  .factory(service.name, service);
