export let directiveName = 'tocAutoSelect';
export default /*@ngInject*/ function tocAutoSelect(
) {
  return {
    restrict: 'A',
    link: function linkAutoSelect(scope, element) {
      element.bind('click', function() {
        element[0].select();
      });
    }
  };
}
