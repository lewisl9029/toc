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
          title: 'Remove Data',
          template: `
            <p>All local data will be gone.</p>
            <p>Are you absolutely sure?</p>
          `,
          okText: 'Remove',
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
          template: `
            <p>You'll have to sign in again.</p>
            <p>Are you sure?</p>
          `,
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
