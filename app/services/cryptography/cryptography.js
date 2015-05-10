import angular from 'angular';

import forge from 'libraries/forge/forge';

import service from './cryptography-service';

export default angular.module('toc.services.cryptography', [
    forge.name
  ])
  .factory(service.name, service);
