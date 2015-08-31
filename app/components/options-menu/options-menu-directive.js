import template from './options-menu.html!text';

export let directiveName = 'tocOptionsMenu';
export default /*@ngInject*/ function tocOptionsMenu() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'optionsMenu',
    controller: /*@ngInject*/ function OptionsMenuController(
      $ionicPopup,
      session,
      state
    ) {
      this.showDeleteDataConfirm = function showDeleteDataConfirm() {
        let deleteDataPopup = $ionicPopup.confirm({
          title: 'Delete Data',
          template: 'Absolutely sure you\'d like to delete all local data?',
          okText: 'Delete local data',
          okType: 'button-assertive button-outline',
          cancelType: 'button-calm button-outline'
        });

        deleteDataPopup.then((response) => {
          if (!response) {
            return;
          }

          return state.destroy();
        });
      };

      this.showSignoutConfirm = function showSignoutConfirm() {
        let signoutPopup = $ionicPopup.confirm({
          title: 'Sign Out',
          template: 'Are you sure you\'d like to sign out of Toc?',
          okText: 'Sign out',
          okType: 'button-assertive button-outline',
          cancelType: 'button-calm button-outline'
        });

        signoutPopup.then((response) => {
          if (!response) {
            return;
          }

          return session.destroy();
        });
      };
    }
  };
}
