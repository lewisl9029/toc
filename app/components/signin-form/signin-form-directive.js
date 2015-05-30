import template from './signin-form.html!text';
import userListTemplate from './signin-form-user-list.html!text';

export default function tocSigninForm() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'signinForm',
    controller: function SigninFormController($q, $state, $scope, state,
      identity, network, contacts, notification, signinForm, R, $ionicModal,
      $ionicHistory) {
      //TODO: refactor into state service .memory
      this.model = signinForm;

      this.goBack = function goBack() {
        $ionicHistory.goBack();
      };

      let localUsers = state.cloudUnencrypted.tree;

      this.model.users = R.mapObj(R.prop('identity'))(localUsers.get());
      this.model.userList = R.pipe(
        R.values,
        R.sortBy((user) => user.latestSession ? user.latestSession * -1 : 0)
      )(this.model.users) || [];

      this.model.selectedUser = this.model.userList[0] ?
        this.model.userList[0].userInfo.id : undefined;
      this.model.password = '';
      this.model.staySignedIn = false;

      //TODO: add check for already signed in users (i.e. hitting back button)?
      this.signIn = function(userCredentials) {
        let options = {
          staySignedIn: this.model.staySignedIn
        };

        this.signingIn = identity.initialize(userCredentials.id)
          .then(() => identity.authenticate(userCredentials, options))
          .then(() => state.cloud.initialize(userCredentials.id))
          .then(() => contacts.initialize())
          .then(() => {
            let sessionInfo = state.cloud.cursors.network.get(
              ['sessions', userCredentials.id, 'sessionInfo']
            );

            return network.initialize(sessionInfo.keypair)
              .then(() => network.initializeChannels());
          })
          .then(() => state.save(
            state.cloudUnencrypted.cursors.identity,
            ['latestSession'],
            Date.now()
          ))
          .then(() => {
            $ionicHistory.nextViewOptions({
              historyRoot: true,
              disableBack: true
            });

            return $state.go('app.home');
          })
          .catch((error) => {
            return notification.error(error, 'Authentication Error')
              .then(() => identity.destroy());
          });

        return this.signingIn;
      };

      $scope.model = signinForm;
      $scope.userListModal = $ionicModal.fromTemplate(userListTemplate, {
        scope: $scope,
        animation: 'slide-in-up'
      });

      this.userListModal = $scope.userListModal;

      //FIXME: dangling listener, clean up on destroy
      localUsers.on('update', () => {
        this.model.users = R.mapObj(R.prop('identity'))(localUsers.get());
        this.model.userList = R.pipe(
          R.values,
          R.sortBy((user) => user.latestSession ? user.latestSession * -1 : 0)
        )(this.model.users);
      });
    }
  };
}
