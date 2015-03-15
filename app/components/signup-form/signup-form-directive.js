import template from './signup-form.html!text';

export default function tocSignupForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signupForm',
    controller: function SignupFormController($state, identity) {
      this.newUser = {
        displayName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      };

      this.createUser = function createUser(userInfo) {
        identity.create(userInfo)
          .then(() => $state.go('app.home'));
      };
    }
  };
}
