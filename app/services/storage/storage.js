import angular from 'angular';

import remoteStorage from 'libraries/remote-storage/remote-storage';

import service from './storage-service';

let storage = angular.module('toc.services.storage', [
    remoteStorage.name
  ])
  .factory(service.name, service);

export default storage;
