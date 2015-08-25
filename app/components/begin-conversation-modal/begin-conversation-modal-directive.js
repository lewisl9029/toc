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
      $cordovaBarcodeScanner,
      $ionicPopup,
      $q,
      $scope,
      contacts,
      state
    ) {
      this.hideModal = $scope.hideModal;
      this.userId = state.cloud.identity.get().userInfo.id;

      this.contactId = '';

      this.inviteMethod = 'enter';

      this.inviteMethods = {
        'enter': {
          icon: 'ion-ios-compose',
          text: 'Enter someone\'s ID',
          doInvite: () => {
            let invitePopup = $ionicPopup.show({
              template: `
                <input type="text" placeholder="Your contact's user ID."
                  ng-model="beginConversationModal.contactId" toc-auto-focus>
              `,
              title: 'Enter ID',
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
                    if (!this.contactId) {
                      event.preventDefault();
                      return;
                    }

                    return contacts.invite(this.contactId)
                      .then((contactChannel) => state.save(
                        state.cloud.channels,
                        [contactChannel.id, 'sentInvite'],
                        true
                      ))
                      .then(() => state.save(
                        state.cloud.contacts,
                        [this.contactId, 'statusId'],
                        0
                      ))
                      .then(() => {
                        this.contactId = '';
                        this.hideModal();
                      });
                  }
                }
              ]
            });
          }
        },
        'scan': {
          icon: 'ion-camera',
          text: 'Scan a picture ID',
          doInvite: () => {
            if (!$window.cordova) {
              return;
            }
            $cordovaBarcodeScanner.scan()
              //TODO: validate this
              .then((barcodeData) => contacts.invite(barcodeData.text))
              .then((contactChannel) => state.save(
                state.cloud.channels,
                [contactChannel.id, 'sentInvite'],
                true
              ))
              .then(() => state.save(
                state.cloud.contacts,
                [this.contactId, 'statusId'],
                0
              ))
              .then(() => {
                this.hideModal();
              });
          }
        },
        'mail': {
          icon: 'ion-email',
          text: 'Send an invite email',
          doInvite: () => {

          }
        }
      };

      this.doInvite = () => {
        this.inviteMethods[this.inviteMethod].doInvite();
      };

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
