import template from './header.html!text';

export default function tocHeader() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'header',
    controller: function HeaderController($state, state, navigation) {
      // let identityCursor = state.cloud.identity;

      // this.currentUser = identityCursor.get();

      this.signOut = function signOut() {
        //TODO: clear synchronized tree and remove remotestorage module
        $state.go('app.welcome');
      };

      this.isPrivateState = navigation.isPrivateState;

      // currentUserCursor.on('update', () => {
      //   this.currentUser = identityCursor.get();
      // });
    }
  };
}
