import angular from 'angular';

import service from './devices-service';

export default angular.module('toc.services.devices', [])
  .factory(service.name, service);
