import angular from 'angular';

import service from './layout-service';

export default angular.module('toc.services.layout', [
  ])
  .factory(service.name, service);
