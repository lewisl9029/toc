export let directiveName = 'tocEqualTo';
export default /*@ngInject*/ function tocEqualTo() {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      otherValue: '=tocEqualTo'
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.equalTo = function(modelValue) {
        return modelValue === scope.otherValue;
      };

      scope.$watch('otherValue', function() {
        ngModel.$validate();
      });
    }
  };
}
