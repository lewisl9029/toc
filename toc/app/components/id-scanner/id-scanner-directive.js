import template from './id-scanner.html!text';

export let directiveName = 'tocIdScanner';
export default /*@ngInject*/ function tocIdScanner(
  html5Qrcode
) {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'idScanner',
    controller: /*@ngInject*/ function IdScannerController(
    ) {
    },
    link: function linkIdScanner(scope, element, attrs) {
      html5Qrcode.createQrScanner('.toc-id-scanner');
    }
  };
}
