import angular from 'angular';

import storage from 'services/storage/storage';

import directive from './remote-storage-directive';

let header = angular.module('toc.components.remote-storage', [
    storage.name
  ])
  .directive(directive.name, directive);

export default header;
