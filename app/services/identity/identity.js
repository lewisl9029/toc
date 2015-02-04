import angular from 'angular';

import storage from 'services/storage/storage';

import service from './identity-service';

let identity = angular.module('toc.services.identity', [
    storage.name
  ])
  .factory(service.name, service);

export default identity;
