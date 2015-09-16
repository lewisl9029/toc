import angular from 'angular';

import service, { serviceName } from './storage-service';

export default angular.module('toc.services.storage', [])
  .factory(serviceName, service);
