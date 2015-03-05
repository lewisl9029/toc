import angular from 'angular';

import storage from 'services/storage/storage';

import service from './state-service';

export default angular.module('toc.services.state', [
    storage.name
  ])
  .factory(service.name, service);
