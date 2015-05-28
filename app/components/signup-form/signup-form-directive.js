import template from './signup-form.html!text';

export default function tocSignupForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signupForm',
    controller: function SignupFormController($q, $state, state, identity,
      network, notification, storage, $ionicHistory) {
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
                state.save(
                  state.local.cursors.identity,
                  ['userInfo'],
                  newUserInfo
                );

                state.save(
                  state.local.cursors.identity,
                  ['latestSession'],
                  Date.now()
                );

                return state.cloud.initialize(newUserInfo.id)
                  .then(() => state.save(
                    state.cloud.cursors.identity,
                    ['userInfo'],
                    newUserInfo
                  ));
              })
              .then(() => state.save(
                state.cloud.cursors.network,
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
          .catch((error) => {
            return notification.error(error, 'User Creation Error')
              .then(() => identity.destroy());
          });

        return this.signingUp;
      };

      let localUsers = state.local.tree;

      this.users = localUsers.get();

      localUsers.on('update', () => {
        this.users = localUsers.get();
      });
    }
  };
}
