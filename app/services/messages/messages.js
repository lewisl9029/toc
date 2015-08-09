import angular from 'angular';

import service, { serviceName } from './messages-service';

export default angular.module('toc.services.messages', [])
  .factory(serviceName, service);
