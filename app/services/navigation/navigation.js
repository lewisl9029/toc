import angular from 'angular';

import service, { serviceName } from './navigation-service';

export default angular.module('toc.services.navigation', [
  ])
  .factory(serviceName, service);
