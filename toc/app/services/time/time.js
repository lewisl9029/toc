import angular from 'angular';

import service, { serviceName } from './time-service';

export default angular.module('toc.services.time', [])
  .factory(serviceName, service);
