import angular from 'angular';

import storage from 'services/storage/storage';
import state from 'services/state/state';

import service from './identity-service';

export default angular.module('toc.services.identity', [
    storage.name,
    state.name
  ])
  .factory(service.name, service);
