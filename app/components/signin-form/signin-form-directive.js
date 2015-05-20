import template from './signin-form.html!text';
import userListTemplate from './signin-form-user-list.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController($q, $state, $scope, state,
      identity, network, contacts, notification, signinForm, R, $ionicModal) {
      //TODO: refactor into state service .transient
      this.model = signinForm;

      let localUsersCursor = state.persistent.cursors.identity;

      this.model.users = localUsersCursor.get() || {};
      this.model.userList = R.pipe(
        R.values,
        R.sortBy((user) => user.latestSession ? user.latestSession * -1 : 0)
      )(this.model.users) || [];

      this.model.selectedUser = this.model.userList[0] ?
        this.model.userList[0].userInfo.id : undefined;
      this.model.password = '';
      this.model.staySignedIn = false;

      this.signIn = function(userCredentials) {
        let options = {
          staySignedIn: this.model.staySignedIn
        };

        this.signingIn = identity.authenticate(userCredentials, options)
          .then((userCredentials) => {
            state.save(
              state.persistent.cursors.identity,
              [userCredentials.id, 'latestSession'],
              Date.now()
            );

            return state.synchronized.initialize(userCredentials.id);
          })
          .then(() => {
            contacts.initialize()
              .catch((error) => notification.error(error, 'Contacts Error'));

            let sessionInfo = state.synchronized.cursors.network.get(
              ['sessions', userCredentials.id, 'sessionInfo']
            );

            network.initialize(sessionInfo.keypair)
              .catch((error) =>
                notification.error(error, 'Network Init Error'));

            return $state.go('app.home');
          })
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
