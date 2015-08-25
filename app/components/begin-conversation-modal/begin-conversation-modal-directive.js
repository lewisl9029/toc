import template from './begin-conversation-modal.html!text';

export let directiveName = 'tocBeginConversationModal';
export default /*@ngInject*/ function tocBeginConversationModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      hideModal: '&'
    },
    controllerAs: 'beginConversationModal',
    controller: /*@ngInject*/ function BeginConversationModalController(
      $scope,
      $ionicPopup,
      state
    ) {
      this.hideModal = $scope.hideModal;
      this.userId = state.cloud.identity.get().userInfo.id;
      this.showIdPopup = () => {
        $ionicPopup.show({
          title: 'Your ID',
          cssClass: 'toc-id-popup',
          scope: $scope,
          buttons: [{
            text: 'Ok',
            type: 'button-balanced button-outline'
          }],
          template: `
            <div class="list">
              <label class="toc-id-input item item-input">
                <input type="text" ng-model="::beginConversationModal.userId"
                  readonly toc-auto-select>
              </label>
              <div class="item item-image">
                <toc-qr-image data="{{::beginConversationModal.userId}}">
                </toc-qr-image>
              </div>
            </div>
          `
        });
      };
    }
  };
}
