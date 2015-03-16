import angular from 'angular';

import Baobab from './baobab/baobab';
import moment from './moment/moment';
import ramda from './ramda/ramda';
import remoteStorage from './remote-storage/remote-storage';
import sjcl from './sjcl/sjcl';

export default angular.module('toc.libraries', [
  Baobab.name,
  moment.name,
  ramda.name,
  remoteStorage.name,
  sjcl.name
]);
