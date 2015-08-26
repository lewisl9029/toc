import angular from 'angular';

import qrImage from 'qr-image';

export default angular.module('toc.libraries.qr-image', [])
  .factory('qrImage', /*@ngInject*/ () => qrImage);
