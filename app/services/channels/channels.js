import angular from 'angular';

import service from './channels-service';

export default angular.module('toc.services.channels', [])
  .factory(service.name, service);
