import angular from 'angular';

import ramda from './ramda/ramda';
import remoteStorage from './remote-storage/remote-storage';

export default angular.module('toc.libraries', [
  ramda.name,
  remoteStorage.name
]);
