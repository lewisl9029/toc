import template from './signup-form.html!text';

export default function tocSignupForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signupForm',
    controller: function SignupFormController($q, $state, state, identity,
      network, notification) {
      this.newUser = {
        displayName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      };

      this.createUser = function createUser(userInfo) {
        if (!userInfo.displayName) {
          userInfo.displayName = 'Anonymous';
        }

        this.signingUp = network.initialize()
          .then((sessionInfo) => {
            return identity.create(sessionInfo, userInfo)
              .then((newUserInfo) => {
                state.save(
                  state.persistent.cursors.identity,
                  [newUserInfo.id, 'userInfo'],
                  newUserInfo
                );

                state.save(
                  state.persistent.cursors.identity,
                  [newUserInfo.id, 'latestSession'],
                  Date.now()
                );

                return state.synchronized.initialize(newUserInfo.id)
                  .then(() => state.save(
                    state.synchronized.cursors.identity,
                    ['userInfo'],
                    newUserInfo
                  ));
              })
              .then(() => state.save(
                state.synchronized.cursors.network,
                ['sessions', sessionInfo.id, 'sessionInfo'],
                sessionInfo
              ));
          })
          .then(() => $state.go('app.home'))
          .catch((error) => notification.error(error, 'User Creation Error'));

        return this.signingUp;
      };

      let localUsersCursor = state.persistent.cursors.identity;

      this.users = localUsersCursor.get();

      localUsersCursor.on('update', () => {
        this.users = localUsersCursor.get();
      });
    }
  };
}
