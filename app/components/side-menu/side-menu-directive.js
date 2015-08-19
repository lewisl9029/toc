import template from './side-menu.html!text';

export let directiveName = 'tocSideMenu';
export default /*@ngInject*/ function tocSideMenu() {
  return {
    restrict: 'E',
    template: template,
    controllerAs: 'sideMenu',
    controller: /*@ngInject*/ function SideMenuController(
      $ionicPopup,
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
        return navigation.goFromMenu('home');
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

      $scope.invitePopup = {};

      this.openInvitePopup = function openInvitePopup() {
        let invitePopup = $ionicPopup.show({
          template: `
            <form novalidate>
              <input type="text" placeholder="Your contact's user ID."
                ng-model="invitePopup.userId" toc-auto-focus>
            </form>`,
          title: 'Add Contact',
          scope: $scope,
          buttons: [
            {
              text: 'Cancel',
              type: 'button-outline button-calm'
            },
            {
              text: 'Invite',
              type: 'button-outline button-balanced',
              onTap: (event) => {
                if (!$scope.invitePopup.userId) {
                  event.preventDefault();
                  return;
                }

                return invite($scope.invitePopup);
              }
            }
          ]
        });
      };
    }
  };
}
