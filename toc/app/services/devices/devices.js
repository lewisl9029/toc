import angular from 'angular';

import service, { serviceName } from './devices-service';

export default angular.module('toc.services.devices', [])
  .factory(serviceName, service);
