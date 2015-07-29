import template from './signin-form.html!text';
import userListTemplate from './signin-form-user-list.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController($q, $state, $scope, state,
      identity, network, contacts, notification, signinForm, R, $ionicModal,
      devices, $ionicHistory, session) {
      //TODO: refactor into state service .memory
      this.model = signinForm;

      this.getAvatar = identity.getAvatar;

      this.goBack = function goBack() {
        $ionicHistory.goBack();
      };

      let savedUsersCursor = state.cloudUnencrypted.cursor;

      let updateSavedUsers = () => {
        this.model.users = R.mapObj(R.prop('identity'))(savedUsersCursor.get());
        this.model.userList = R.pipe(
          R.values,
          R.sortBy((user) => user.latestSession ? user.latestSession * -1 : 0)
        )(this.model.users);
      };

      state.addListener(savedUsersCursor, updateSavedUsers, $scope);

      this.model.selectedUser = this.model.userList[0] ?
        this.model.userList[0].userInfo.id : undefined;
      this.model.password = '';
      this.model.staySignedIn = false;

      this.signIn = function(userCredentials) {
        let signinOptions = {
          staySignedIn: this.model.staySignedIn
        };

        return session.signIn(userCredentials, signinOptions);
      };

      $scope.model = signinForm;
      $scope.getAvatar = identity.getAvatar;
      $scope.userListModal = $ionicModal.fromTemplate(userListTemplate, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      this.userListModal = $scope.userListModal;
    }
  };
}
