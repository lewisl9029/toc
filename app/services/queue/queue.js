import angular from 'angular';

import service, { serviceName } from './queue-service';

export default angular.module('toc.services.queue', [])
  .factory(serviceName, service);
