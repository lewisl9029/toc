import angular from 'angular';

import service, { serviceName } from './session-service';

export default angular.module('toc.services.session', [])
  .factory(serviceName, service);
