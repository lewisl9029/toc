import angular from 'angular';

import qrEncode from 'qr-encode';

export default angular.module('toc.libraries.qr-encode', [])
  .factory('qrEncode', () => qrEncode);
