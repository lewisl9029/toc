import template from './message-input-area.html!text';

export let directiveName = 'tocMessageInputArea';
export default /*@ngInject*/ function tocMessageInputArea() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      channelId: '@'
    },
    controllerAs: 'messageInputArea',
    controller: /*@ngInject*/ function MessageInputAreaController(
      $scope,
      message
    ) {
      this.channelId = $scope.channelId;

      this.message = '';

      this.send = () => {
        let message = this.message;
        this.message = '';

        return messages.saveSendingMessage(this.channelId, message);
      };
    }
  };
}
