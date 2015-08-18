import template from './side-menu.html!text';

export let directiveName = 'tocSideMenu';
export default /*@ngInject*/ function tocSideMenu() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'sideMenu',
    controller: /*@ngInject*/ function SideMenuController(
      $scope,
      state,
      navigation
    ) {
      let viewIdCursor = state.cloud.navigation.select(['activeViewId']);
      let updateViewId = () => {
        this.viewId = viewIdCursor.get();
      };
      state.addListener(viewIdCursor, updateViewId, $scope);

      this.goToHome = function goToHome() {
        return navigation.goFromMenu('home');
      };

      this.openInvitePopup = function openInvitePopup() {

      };
    }
  };
}
