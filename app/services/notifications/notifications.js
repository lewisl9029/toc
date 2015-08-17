import angular from 'angular';

import service, { serviceName } from './notification-service';

export default angular.module('toc.services.notification', [])
  .factory(serviceName, service);
