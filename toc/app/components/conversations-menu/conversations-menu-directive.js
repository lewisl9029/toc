import template from './conversations-menu.html!text';

export let directiveName = 'tocConversationsMenu';
export default /*@ngInject*/ function tocConversationsMenu() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'conversationsMenu',
    controller: /*@ngInject*/ function ConversationsMenuController(
      $ionicModal,
      $q,
      $scope,
      channels,
      contacts,
      navigation,
      state
    ) {
      let viewIdCursor = state.cloud.navigation.select(['activeViewId']);
      let updateViewId = () => {
        this.viewId = viewIdCursor.get();
      };
      state.addListener(viewIdCursor, updateViewId, $scope);

      this.goToHome = function goToHome() {
        return navigation.navigate('home');
      };

      this.showBeginConversationModal = function showBeginConversationModal() {
        let modalTemplate = `
          <toc-begin-conversation-modal class="toc-modal-container"
            remove-modal="conversationsMenu.beginConversationModal.remove()">
          </toc-begin-conversation-modal>
        `;

        let modalName = 'beginConversationModal';

        return navigation.showModal(modalName, modalTemplate, this, $scope);
      };
    }
  };
}
