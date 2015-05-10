import angular from 'angular';

import sjcl from 'libraries/sjcl/sjcl';
import forge from 'libraries/forge/forge';

import service from './cryptography-service';

export default angular.module('toc.services.cryptography', [
    sjcl.name,
    forge.name
  ])
  .factory(service.name, service);
