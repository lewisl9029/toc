import angular from 'angular';

import service, { serviceName } from './state-service';

export default angular.module('toc.services.state', [])
  .factory(serviceName, service);
