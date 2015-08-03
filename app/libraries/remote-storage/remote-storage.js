import angular from 'angular';

import remoteStorage from 'remotestoragejs';

export default angular.module('toc.libraries.remote-storage', [])
  .factory('remoteStorage', /*@ngInject*/ () => remoteStorage);
