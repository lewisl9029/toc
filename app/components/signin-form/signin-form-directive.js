import template from './signin-form.html!text';
import userListTemplate from './signin-form-user-list.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController($q, $state, $scope, state,
      identity, notification, signinForm, R, $ionicModal) {
      this.model = signinForm;

      let localUsersCursor = state.persistent.cursors.identity;

      this.model.users = localUsersCursor.get() || {};
      this.model.userList = R.pipe(
        R.values,
        R.sortBy((user) => user.latestSession ? user.latestSession * -1 : 0)
      )(this.model.users) || [];

      //TODO: store last signin time and use for default selected user
      this.model.selectedUser = this.model.userList[0] ?
        this.model.userList[0].userInfo.id : undefined;
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
      $scope.userListModal = $ionicModal.fromTemplate(userListTemplate, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      this.userListModal = $scope.userListModal;

      //FIXME: dangling listener, clean up on destroy
      localUsersCursor.on('update', () => {
        this.model.users = localUsersCursor.get();
        this.model.userList = R.pipe(
          R.values,
          R.sortBy((user) => user.latestSession ? user.latestSession * -1 : 0)
        )(this.model.users);
      });
    }
  };
}
