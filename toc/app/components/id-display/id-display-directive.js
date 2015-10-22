import template from './id-display.html!text';

export let directiveName = 'tocIdDisplay';
export default /*@ngInject*/ function tocIdDisplay(
  state
) {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'idDisplay',
    controller: /*@ngInject*/ function IdDisplayController(
    ) {
      this.userId = state.cloud.identity.get(['userInfo', 'id']);
    },
    link: function linkIdDisplay(scope, element, attrs) {
      // FIXME: I still don't know why .find doesn't work
      let qrImage = element.children().children().children()[0];
      let idInput = element.children().children().children()[1];

      angular.element(qrImage).bind('click', function (event) {
        angular.element(idInput).triggerHandler('click');
      });
    }
  };
}
