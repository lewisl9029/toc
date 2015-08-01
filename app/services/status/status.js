import angular from 'angular';

import service from './status-service';

export default angular.module('toc.services.status', [])
  .factory(service.name, service);
