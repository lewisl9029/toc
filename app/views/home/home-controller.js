export let controllerName = 'HomeController';
export default /*@ngInject*/ function HomeController(
  $ionicModal,
  $scope,
  session,
  state,
  storage
) {
  let currentUserCursor = state.cloud.identity;
  let updateCurrentUser = () => {
    this.currentUser = currentUserCursor.get();
  };

  state.addListener(currentUserCursor, updateCurrentUser, $scope);

  //FIXME: this should probably go into state.memory if possible
  this.isStorageConnected = storage.isConnected;

  this.openBeginConversationModal = function openBeginConversationModal() {
    this.beginConversationModal = $ionicModal.fromTemplate(
      `
      <toc-begin-conversation-modal class="toc-modal-container"
        remove-modal="homeView.beginConversationModal.remove()">
      </toc-begin-conversation-modal>
      `,
      { scope: $scope }
    );

    this.beginConversationModal.show();
  };

  this.showUpdateProfileModal = function showUpdateProfileModal() {
    this.updateProfileModal = $ionicModal.fromTemplate(
      `
      <toc-update-profile-modal class="toc-modal-container"
        remove-modal="homeView.updateProfileModal.remove()">
      </toc-update-profile-modal>
      `,
      { scope: $scope }
    );

    this.updateProfileModal.show();
  };
}
