export let controllerName = 'HomeController';
export default /*@ngInject*/ function HomeController(
  $scope,
  navigation
) {
  this.showBeginConversationModal = function showBeginConversationModal() {
    let modalTemplate = `
      <toc-begin-conversation-modal class="toc-modal-container"
        remove-modal="homeView.beginConversationModal.remove()">
      </toc-begin-conversation-modal>
    `;

    let modalName = 'beginConversationModal';

    return navigation.showModal(modalName, modalTemplate, this, $scope);
  };

  this.showUpdateProfileModal = function showUpdateProfileModal() {
    let modalTemplate = `
      <toc-update-profile-modal class="toc-modal-container"
        remove-modal="homeView.updateProfileModal.remove()">
      </toc-update-profile-modal>
    `;

    let modalName = 'updateProfileModal';

    return navigation.showModal(modalName, modalTemplate, this, $scope);
  };
}
