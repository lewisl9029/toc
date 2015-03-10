import angular from 'angular';

import remoteStorage from 'remotestorage/remotestorage.js';

export default angular.module('toc.libraries.remote-storage', [])
  .factory('remoteStorage', () => remoteStorage);
