import template from './signin-form.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController($state, state, identity) {
      let localUsersCursor = identity.IDENTITY_CURSORS.persistent;

      this.users = localUsersCursor.get() || {};
      //TODO: store last signin time and use for default selected user
      this.selectedUser = Object.keys(this.users)[0];
      this.password = '';

      this.signIn = function() {
        identity.authenticate({
          id: this.selectedUser,
          password: this.password
        })
        .then(() => $state.go('app.home'));
      };

      //FIXME: dangling listener, refactor into service
      localUsersCursor.on('update', () => {
        this.users = localUsersCursor.get();
      });
    }
  };
}
