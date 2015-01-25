import angular from 'angular';

import ramda from 'libraries/ramda/ramda';

import service from './contacts-service';

let contacts = angular.module('toc.services.contacts', [
    ramda.name
  ])
  .factory(service.name, service);

export default contacts;
