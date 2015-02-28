import template from './signup-form.html!text';

export default function tocSignupForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signupForm',
    controller: function tocSignupFormController($log) {
      this.newUser = {
        displayName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      };

      this.createUser = function createUser(newUser) {
        $log.info(newUser);
      };
    }
  };
}
