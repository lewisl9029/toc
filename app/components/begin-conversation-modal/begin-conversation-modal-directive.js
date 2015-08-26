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
      $log,
      $q,
      $window,
      $scope,
      contacts,
      devices,
      identity,
      state
    ) {
      this.hideModal = $scope.hideModal;
      this.userInfo = state.cloud.identity.get().userInfo;
      this.userId = this.userInfo.id;
      this.isCordovaApp = devices.isCordovaApp();

      this.contactId = '';

      let initializeSentInvite = (contactChannel) => {
        return state.save(
          state.cloud.channels,
          [contactChannel.id, 'sentInvite'],
          true
        )
        .then(() => state.save(
          state.cloud.contacts,
          [this.contactId, 'statusId'],
          0
        ))
        .then(() => {
          this.hideModal();
          return $q.when();
        });
      };

      this.inviteMethod = 'enter';

      this.inviteMethods = {
        'enter': {
          icon: 'ion-ios-compose',
          text: 'Enter someone\'s ID',
          isEnabled: true,
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
                    if (!identity.validateId(this.contactId)) {
                      event.preventDefault();
                      $log.error('This is not a valid Toc ID.');
                      return;
                    }

                    return contacts.invite(this.contactId)
                      .then(initializeSentInvite)
                      .then(() => {
                        this.contactId = '';
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
          isEnabled: this.isCordovaApp,
          doInvite: () => {
            if (this.isCordovaApp) {
              return $cordovaBarcodeScanner.scan()
                .then((barcodeData) => {
                  let contactId = barcodeData.text;
                  if (!identity.validateId(contactId)) {
                    return $q.reject('This is not a valid Toc picture ID.');
                  }

                  return contacts.invite(contactId);
                })
                .then(initializeSentInvite)
                .catch((error) => $log.error(error));
            }

          }
        },
        'mail': {
          icon: 'ion-email',
          text: 'Send an invite email',
          isEnabled: true,
          doInvite: () => {
            let mailSubject = encodeURIComponent(
              `An invite for Toc Messenger`
            );

            let mailBody = encodeURIComponent(
              'Please invite me as a contact on Toc Messenger:\n' +
              'http://lewisl9029.github.io/toc\n\n' +

              'It\'s pretty great. ^^\n\n' +

              `My Toc ID is ${this.userId}.`
            );

            $window.open(
              `mailto:?to=&body=${mailBody}&subject=${mailSubject}`,
              '_system'
            );

            this.hideModal();
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
