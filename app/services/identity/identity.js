import angular from 'angular';

import storage from 'services/storage/storage';

import service from './identity-service';

export default angular.module('toc.services.identity', [
    storage.name
  ])
  .factory(service.name, service);
