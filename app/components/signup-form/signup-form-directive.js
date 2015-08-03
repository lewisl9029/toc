import template from './signup-form.html!text';

export let directiveName = 'tocSignupForm';
export default /*@ngInject*/ function tocSignupForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signupForm',
    controller: /*@ngInject*/ function SignupFormController(
      $ionicHistory,
      $scope,
      identity,
      session,
      state
    ) {
      this.getAvatar = identity.getAvatar;

      this.goBack = function goBack() {
        $ionicHistory.goBack();
      };

      this.newUser = {
        displayName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      };

      this.staySignedIn = false;

      this.createUser = function createUser(userInfo) {
        if (!userInfo.displayName) {
          userInfo.displayName = 'Anonymous';
        }

        let options = {
          staySignedIn: this.staySignedIn
        };

        return session.signUp(userInfo, options);
      };

      let savedUsersCursor = state.cloudUnencrypted.cursor;
      let updateSavedUsers = () => {
        this.users = savedUsersCursor.get();
      };

      state.addListener(savedUsersCursor, updateSavedUsers, $scope);
    }
  };
}
