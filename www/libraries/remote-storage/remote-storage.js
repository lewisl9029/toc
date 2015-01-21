import angular from 'angular';

import remoteStorage from 'remotestorage.js';

let library = angular.module('toc.libraries.remote-storage', [])
  .factory('remoteStorage', () => remoteStorage);

export default library;
