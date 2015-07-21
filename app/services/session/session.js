import angular from 'angular';

import service from './session-service';

export default angular.module('toc.services.session', [])
  .factory(service.name, service);
