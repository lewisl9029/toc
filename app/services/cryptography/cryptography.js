import angular from 'angular';

import sjcl from 'libraries/sjcl/sjcl';

import service from './cryptography-service';

export default angular.module('toc.services.cryptography', [
    sjcl.name
  ])
  .factory(service.name, service);
