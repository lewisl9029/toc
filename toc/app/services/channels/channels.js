import angular from 'angular';

import service, { serviceName } from './channels-service';

export default angular.module('toc.services.channels', [])
  .factory(serviceName, service);
