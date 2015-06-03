import template from './signup-form.html!text';

export default function tocSignupForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signupForm',
    controller: function SignupFormController($q, $state, state, identity,
      network, notification, storage, $ionicHistory, $scope) {
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

        this.signingUp = network.initialize()
          .then((sessionInfo) => {
            let options = {
              staySignedIn: this.staySignedIn
            };

            return identity.initialize(sessionInfo.id)
              .then(() => network.initializeChannels())
              .then(() => identity.create(sessionInfo, userInfo, options))
              .then((newUserInfo) => {
                return state.save(
                    state.cloudUnencrypted.identity,
                    ['userInfo'],
                    newUserInfo
                  )
                  .then(() => state.cloud.initialize(newUserInfo.id))
                  .then(() => state.save(
                    state.cloud.identity,
                    ['userInfo'],
                    newUserInfo
                  ));
              })
              .then(() => state.save(
                state.cloud.network,
                ['sessions', sessionInfo.id, 'sessionInfo'],
                sessionInfo
              ));
          })
          .then(() => {
            $ionicHistory.nextViewOptions({
              historyRoot: true,
              disableBack: true
            });

            return $state.go('app.home');
          })
          .then(() => state.save(
            state.cloudUnencrypted.identity,
            ['latestSession'],
            Date.now()
          ))
          .catch((error) => {
            return notification.error(error, 'User Creation Error')
              .then(() => identity.destroy());
          });

        return this.signingUp;
      };

      let savedUsersCursor = state.cloudUnencrypted.cursor;
      let updateSavedUsers = () => {
        this.users = savedUsersCursor.get();
      };

      state.addListener(savedUsersCursor, updateSavedUsers, $scope);
    }
  };
}
