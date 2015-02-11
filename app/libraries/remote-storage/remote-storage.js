import angular from 'angular';

import remoteStorage from 'remotestorage.js';

export default angular.module('toc.libraries.remote-storage', [])
  .factory('remoteStorage', () => remoteStorage);
