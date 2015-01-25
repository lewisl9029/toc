import template from './signup-form.html!';

let directive = function tocSignupForm() {
  return {
    restrict: 'E',
    template: template
  };
};

export default directive;
