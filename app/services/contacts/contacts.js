import angular from 'angular';

import service from './contacts-service';

export default angular.module('toc.services.contacts', [])
  .factory(service.name, service);
