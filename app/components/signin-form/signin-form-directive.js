import template from './signin-form.html!text';

let directive = function tocSigninForm() {
  return {
    restrict: 'E',
    template: template
  };
};

export default directive;
