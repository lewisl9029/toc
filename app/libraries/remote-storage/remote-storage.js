import angular from 'angular';

import remoteStorage from './remote-storage-library';

export default angular.module('toc.libraries.remote-storage', [])
  .factory('remoteStorage', /*@ngInject*/ () => remoteStorage);
