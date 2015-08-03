import angular from 'angular';

import service, { serviceName } from './network-service';

export default angular.module('toc.services.network', [])
  .factory(serviceName, service);
