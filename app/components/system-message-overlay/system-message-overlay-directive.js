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
      let hidingSystemMessage;
      this.showSystemMessage = false;

      let systemMessageCursor = state.memory.notifications
        .select('systemMessage');
      let updateSystemMessage = () => {
        this.message = systemMessageCursor.get();
        if (!this.message) {
          this.showSystemMessage = false;
          return;
        }

        this.showSystemMessage = true;
        if (hidingSystemMessage) {
          $timeout.cancel(hidingSystemMessage);
        }

        hidingSystemMessage = $timeout(() => {
          this.showSystemMessage = false;
        }, 5000, false);
      };
      state.addListener(systemMessageCursor, updateSystemMessage, $scope);
    }
  };
}
