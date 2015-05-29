import angular from 'angular';

import service from './navigation-service';

export default angular.module('toc.services.navigation', [
  ])
  .factory(service.name, service);
