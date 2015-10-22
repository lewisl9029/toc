import angular from 'angular';

import 'lewisl9029/html5-qrcode';

export default angular.module('toc.libraries.html5-qrcode', [])
  .factory('html5Qrcode', /*@ngInject*/ ($log, $q, $window) => {
    let createQrScanner = (selector) => {
      let qrData = $q.defer();
      $window.$(selector).html5_qrcode(
        (data) => qrData.resolve(data),
        (error) => $log.debug(error),
        (videoError) => qrData.reject(videoError)
      );
      return qrData.promise;
    };

    let stopQrScanner = (selector) => {
      $window.$(selector).html5_qrcode_stop();
    };

    return {
      createQrScanner,
      stopQrScanner
    };
  });
