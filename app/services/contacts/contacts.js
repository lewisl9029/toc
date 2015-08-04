import angular from 'angular';

import service, { serviceName } from './contacts-service';

export default angular.module('toc.services.contacts', [])
  .factory(serviceName, service);
