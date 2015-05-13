import template from './signup-form.html!text';

export default function tocSignupForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signupForm',
    controller: function SignupFormController($q, $state, identity,
      notification) {
      this.newUser = {
        displayName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      };

      this.createUser = function createUser(userInfo) {
        if (!userInfo.displayName) {
          userInfo.displayName = 'Anonymous';
        }

        this.signingUp = identity.create(userInfo)
          .then(() => $state.go('app.home'))
          .catch((error) => notification.error(error, 'User Creation Error'));

        return this.signingUp;
      };
    }
  };
}
