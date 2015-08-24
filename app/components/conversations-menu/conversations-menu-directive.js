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

      let invite = (invitePopup) => {
        return contacts.invite(invitePopup.userId)
          .then((contactChannel) => state.save(
            state.cloud.channels,
            [contactChannel.id, 'sentInvite'],
            true
          ))
          .then(() => state.save(
            state.cloud.contacts,
            [invitePopup.userId, 'statusId'],
            0
          ))
          .then(() => {
            invitePopup.userId = '';
            return $q.when();
          });
      };

      this.beginConversationModal = $ionicModal.fromTemplate(
        `
        <toc-begin-conversation-modal
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
