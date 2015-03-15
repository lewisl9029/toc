import template from './signin-form.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController(state, identity) {
      let usersCursor = state.persistent.tree.select(identity.IDENTITY_PATH);

      this.users = usersCursor.get() || {};
      //TODO: store last signin time and use for default selected user
      this.selectedUser = Object.keys(this.users)[0];
      this.password = '';

      this.signIn = function() {
        let authResult = identity.authenticate({
          id: this.selectedUser,
          password: this.password
        });
      };

      this.create = identity.create;

      //FIXME: dangling listener, refactor into service
      usersCursor.on('update', () => {
        this.users = usersCursor.get();
      });
    }
  };
}
