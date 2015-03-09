import template from './signin-form.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController(identity) {
      this.users = identity.localUsers;
      //TODO: store last signin time and use for default selected user
      this.selectedUser = Object.keys(identity.localUsers)[0];
      this.password = '';

      this.signIn = function() {
        identity.authenticate({
          id: this.selectedUser,
          password: this.password
        });
      };
    }
  };
}
