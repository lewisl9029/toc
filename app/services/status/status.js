import angular from 'angular';

import service, { serviceName } from './status-service';

export default angular.module('toc.services.status', [])
  .factory(serviceName, service);
