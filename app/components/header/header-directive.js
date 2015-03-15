import template from './header.html!text';

export default function tocHeader() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'header',
    controller: function HeaderController($state, state, identity) {
      let currentUserCursor = identity.IDENTITY_CURSORS.synchronized;

      this.currentUser = currentUserCursor.get();

      this.signOut = function signOut() {
        //TODO: clear synchronized tree and remove remotestorage module
        $state.go('app.welcome');
      };

      currentUserCursor.on('update', () => {
        this.currentUser = currentUserCursor.get();
      });
    }
  };
}
