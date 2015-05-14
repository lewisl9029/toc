import template from './signin-form.html!text';
import userListTemplate from './signin-form-user-list.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController($q, $state, $scope, state,
      identity, notification, signinForm, $ionicModal) {
      this.model = signinForm;

      let localUsersCursor = state.persistent.cursors.identity;

      this.model.users = localUsersCursor.get() || {};
      //TODO: store last signin time and use for default selected user
      this.model.selectedUser = Object.keys(this.model.users)[0];
      this.model.password = '';

      this.signIn = function() {
        this.signingIn = identity.authenticate({
            id: this.model.selectedUser,
            password: this.model.password
          })
          .then(() => $state.go('app.home'))
          .catch((error) => notification.error(error, 'Authentication Error'));

        return this.signingIn;
      };

      $scope.model = signinForm;
      $scope.userList = $ionicModal.fromTemplate(userListTemplate, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      this.userList = $scope.userList;

      //FIXME: dangling listener, clean up on destroy
      localUsersCursor.on('update', () => {
        this.model.users = localUsersCursor.get();
      });
    }
  };
}
