import template from './header.html!text';

export default function tocHeader() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'header',
    controller: function HeaderController($state, state, layout) {
      // let identityCursor = state.synchronized.cursors.identity;

      // this.currentUser = identityCursor.get();

      this.signOut = function signOut() {
        //TODO: clear synchronized tree and remove remotestorage module
        $state.go('app.welcome');
      };

      this.isContactsMenuEnabled = layout.isContactsMenuEnabled;

      // currentUserCursor.on('update', () => {
      //   this.currentUser = identityCursor.get();
      // });
    }
  };
}
