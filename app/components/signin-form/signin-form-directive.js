import template from './signin-form.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController($state, identity, notification) {
      let localUsersCursor = identity.IDENTITY_CURSORS.persistent;

      this.users = localUsersCursor.get() || {};
      this.usersSigninInProgress = {};

      //TODO: store last signin time and use for default selected user
      this.selectedUser = Object.keys(this.users)[0];
      this.password = '';

      this.signIn = function signIn() {
        this.usersSigninInProgress[this.selectedUser] = true;

        return identity.authenticate({
            id: this.selectedUser,
            password: this.password
          })
          .then(() => $state.go('app.home'))
          .catch((error) => notification.error(error, 'Authentication Error'))
          .then(() => {
            this.usersSigninInProgress[this.selectedUser] = false;
          });
      };

      //FIXME: dangling listener, refactor into service
      localUsersCursor.on('update', () => {
        this.users = localUsersCursor.get();
      });
    }
  };
}
