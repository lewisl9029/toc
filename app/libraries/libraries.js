import angular from 'angular';

import angularToastr from './angular-toastr/angular-toastr';
import Baobab from './baobab/baobab';
import forge from './forge/forge';
import ionic from './ionic/ionic';
import moment from './moment/moment';
import ngCordova from './ng-cordova/ng-cordova';
import qrEncode from './qr-encode/qr-encode';
import ramda from './ramda/ramda';
import remoteStorage from './remote-storage/remote-storage';
import telehash from './telehash/telehash';

export default angular.module('toc.libraries', [
  angularToastr.name,
  Baobab.name,
  forge.name,
  ionic.name,
  moment.name,
  ngCordova.name,
  qrEncode.name,
  ramda.name,
  remoteStorage.name,
  telehash.name
]);
