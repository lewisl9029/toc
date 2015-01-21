import angular from 'angular';

import remoteStorage from 'libraries/remote-storage/remote-storage';

import directive from './remote-storage-directive';

let header = angular.module('toc.components.remote-storage', [
    remoteStorage.name
  ])
  .directive(directive.name, directive);

export default header;
