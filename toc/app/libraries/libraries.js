import angular from 'angular';

import Baobab from './baobab/baobab';
import forge from './forge/forge';
import ionic from './ionic/ionic';
import moment from './moment/moment';
import qrImage from './qr-image/qr-image';
import html5Qrcode from './html5-qrcode/html5-qrcode';
import ramda from './ramda/ramda';
import remoteStorage from './remote-storage/remote-storage';
import telehash from './telehash/telehash';

export default angular.module('toc.libraries', [
  Baobab.name,
  forge.name,
  ionic.name,
  moment.name,
  qrImage.name,
  html5Qrcode.name,
  ramda.name,
  remoteStorage.name,
  telehash.name
]);
