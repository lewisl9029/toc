import angular from 'angular';

import service, { serviceName } from './cryptography-service';

export default angular.module('toc.services.cryptography', [])
  .factory(serviceName, service);
