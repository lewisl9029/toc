import angular from 'angular';

import Baobab from './baobab/baobab';
import angularToastr from './angular-toastr/angular-toastr';
import moment from './moment/moment';
import ramda from './ramda/ramda';
import remoteStorage from './remote-storage/remote-storage';
import qrEncode from './qr-encode/qr-encode';
import sjcl from './sjcl/sjcl';
import telehash from './telehash/telehash';

export default angular.module('toc.libraries', [
  angularToastr.name,
  Baobab.name,
  forge.name,
  moment.name,
  ramda.name,
  remoteStorage.name,
  qrEncode.name,
  sjcl.name,
  telehash.name
]);
