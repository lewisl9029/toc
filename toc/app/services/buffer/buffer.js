import angular from 'angular';

import service, { serviceName } from './buffer-service';

export default angular.module('toc.services.buffer', [])
  .factory(serviceName, service);
