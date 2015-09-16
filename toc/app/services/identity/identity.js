import angular from 'angular';

import service, { serviceName } from './identity-service';

export default angular.module('toc.services.identity', [])
  .factory(serviceName, service);
