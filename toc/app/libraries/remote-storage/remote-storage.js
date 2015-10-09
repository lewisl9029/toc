import angular from 'angular';

// custom fork of remoteStorage v0.11.2 with cordova oauth support
// TODO: remoteStorage v0.12.x should obsolete this, migrate when available
import remoteStorage from 'remotestoragejs';

export default angular.module('toc.libraries.remote-storage', [])
  .factory('remoteStorage', /*@ngInject*/ () => remoteStorage);
