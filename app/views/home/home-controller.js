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

  this.beginConversationModal = $ionicModal.fromTemplate(
    `
    <toc-begin-conversation-modal class="toc-modal-container"
      hide-modal="homeView.beginConversationModal.hide()">
    </toc-begin-conversation-modal>
    `,
    { scope: $scope }
  );

  this.openBeginConversationModal = function openBeginConversationModal() {
    this.beginConversationModal.show();
  };

  this.updateProfileModal = $ionicModal.fromTemplate(
    `
    <toc-update-profile-modal class="toc-modal-container"
      hide-modal="homeView.updateProfileModal.hide()">
    </toc-update-profile-modal>
    `,
    { scope: $scope }
  );

  this.showUpdateProfileModal = function showUpdateProfileModal() {
    this.updateProfileModal.show();
  };
}
