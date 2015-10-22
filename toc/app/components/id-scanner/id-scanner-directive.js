import template from './id-scanner.html!text';

export let directiveName = 'tocIdScanner';
export default /*@ngInject*/ function tocIdScanner(
  state
) {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'idScanner',
    controller: /*@ngInject*/ function IdScannerController(
    ) {
    },
    link: function linkIdScanner(scope, element, attrs) {

    }
  };
}
