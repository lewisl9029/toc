//workaround for transition performance issues with ionic navigation + autofocus
export let directiveName = 'tocAutoFocus';
export default /*@ngInject*/ function tocAutoFocus(
  $timeout
) {
  return {
    restrict: 'A',
    link: function linkAutoFocus(scope, element) {
      $timeout(() => element[0].focus(), 500, false);
    }
  };
}
