import angular from 'angular';

import service from './state-service';

export default angular.module('toc.services.state', [
  ])
  .factory(service.name, service);
