import template from './signin-form.html!';

let directive = function tocSigninForm() {
  return {
    restrict: 'E',
    template: template
  };
};

export default directive;
