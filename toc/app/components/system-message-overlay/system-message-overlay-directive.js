import template from './system-message-overlay.html!text';

export let directiveName = 'tocSystemMessageOverlay';
export default /*@ngInject*/ function tocSystemMessageOverlay() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'systemMessageOverlay',
    controller: /*@ngInject*/ function SystemMessageOverlayController(
      $scope,
      $timeout,
      state
    ) {
      let hidingSystemMessage = null;
      this.showSystemMessage = false;

      let systemMessageCursor = state.memory.notifications
        .select('systemMessage');
      let updateSystemMessage = () => {
        this.message = systemMessageCursor.get();
        if (!this.message) {
          this.showSystemMessage = false;
          return;
        }

        if (hidingSystemMessage) {
          $timeout.cancel(hidingSystemMessage);
          this.showSystemMessage = false;
          // let existing notification animate out, then animate in new one
          return $timeout(() => {
            this.showSystemMessage = true;
            hidingSystemMessage = $timeout(() => {
              hidingSystemMessage = null;
              this.showSystemMessage = false;
            }, 5000);
          }, 1000);
        }

        this.showSystemMessage = true;
        hidingSystemMessage = $timeout(() => {
          hidingSystemMessage = null;
          this.showSystemMessage = false;
        }, 5000);
      };
      state.addListener(systemMessageCursor, updateSystemMessage, $scope);
    }
  };
}
