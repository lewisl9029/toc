import angular from 'angular';

import Baobab from './baobab/baobab';
import angularToastr from './angular-toastr/angular-toastr';
import moment from './moment/moment';
import ramda from './ramda/ramda';
import remoteStorage from './remote-storage/remote-storage';
import sjcl from './sjcl/sjcl';
import telehash from './telehash/telehash';

export default angular.module('toc.libraries', [
  angularToastr.name,
  Baobab.name,
  moment.name,
  ramda.name,
  remoteStorage.name,
  sjcl.name,
  telehash.name
]);
