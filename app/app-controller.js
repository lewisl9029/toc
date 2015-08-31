export let controllerName = 'AppController';
export default /*@ngInject*/ function AppController(
  $ionicPopover
) {
  this.optionsMenuPopover = $ionicPopover.fromTemplate(
    `
    <ion-popover-view>
      <toc-options-menu></toc-options-menu>
    </ion-popover-view>
    `
  );

  this.openOptionsMenuPopover = function openOptionsMenuPopover($event) {
    this.optionsMenuPopover.show($event);
  };
}
