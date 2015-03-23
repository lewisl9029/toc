import template from './signup-form.html!text';

export default function tocSignupForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signupForm',
    controller: function SignupFormController($state, identity, notification) {
      this.newUser = {
        displayName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      };

      this.signupInProgress;

      this.createUser = function createUser(userInfo) {
        this.signupInProgress = true;
        identity.create(userInfo)
          .then(() => $state.go('app.home'))
          .catch((error) => notification.error(error, 'User Creation Error'))
          .then(() => {
            this.signupInProgress = false;
          });
      };
    }
  };
}
