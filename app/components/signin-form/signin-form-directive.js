import template from './signin-form.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController(state, identity) {
      this.users = state.persistent.tree.select;
      //TODO: store last signin time and use for default selected user
      this.selectedUser = Object.keys(identity.localUsers)[0];
      this.password = '';

      this.signIn = function() {
        let authResult = identity.authenticate({
          id: this.selectedUser,
          password: this.password
        });
      };
    }
  };
}
