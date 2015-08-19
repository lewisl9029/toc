import angular from 'angular';

import service, { serviceName } from './notifications-service';

export default angular.module('toc.services.notifications', [])
  .factory(serviceName, service);
