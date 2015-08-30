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

      this.beginConversationModal = $ionicModal.fromTemplate(
        `
        <toc-begin-conversation-modal class="toc-modal-container"
          hide-modal="conversationsMenu.beginConversationModal.hide()">
        </toc-begin-conversation-modal>
        `,
        { scope: $scope }
      );

      this.openBeginConversationModal = function openBeginConversationModal() {
        this.beginConversationModal.show();
      };
    }
  };
}
