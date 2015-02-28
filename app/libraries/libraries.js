import angular from 'angular';

import ramda from './ramda/ramda';
import remoteStorage from './remote-storage/remote-storage';
import sjcl from './sjcl/sjcl';

export default angular.module('toc.libraries', [
  ramda.name,
  remoteStorage.name,
  sjcl.name
]);
