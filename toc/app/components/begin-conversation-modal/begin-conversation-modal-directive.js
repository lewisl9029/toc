import template from './begin-conversation-modal.html!text';

export let directiveName = 'tocBeginConversationModal';
export default /*@ngInject*/ function tocBeginConversationModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      removeModal: '&'
    },
    controllerAs: 'beginConversationModal',
    controller: /*@ngInject*/ function BeginConversationModalController(
      $ionicPopup,
      $log,
      $q,
      $window,
      $scope,
      $timeout,
      contacts,
      navigation,
      notifications,
      devices,
      html5Qrcode,
      identity,
      state
    ) {
      this.removeModal = $scope.removeModal;
      this.userInfo = state.cloud.identity.get().userInfo;
      this.userId = this.userInfo.id;
      this.isCordovaApp = devices.isCordovaApp();

      this.contactId = '';

      this.inviteMethod = 'enter';

      let handleInviteError = (error) => {
        if (error === 'contact: cannot invite self') {
          return notifications.notifySystem(
            'Cannot invite self'
          );
        }

        if (error === 'contact: contact already exists') {
          return notifications.notifySystem(
            'This contact already exists'
          );
        }

        if (error === 'contacts: qr reader cancelled' ||
          error.message === 'contacts: qr reader cancelled') {
          return notifications.notifySystem(
            'QR reader ran into a problem. Please try again.'
          );
        }

        return notifications.notifyGenericError(error);
      };

      this.sendInvite = (event) => {
        if (!identity.validateId(this.contactId)) {
          if (event) {
            event.preventDefault();
          }
          return notifications.notifySystem(
            `Please enter a valid Toc ID.`
          );
        }

        return contacts.saveSendingInvite(this.contactId)
          .then(() => {
            this.removeModal();
            this.contactId = '';
            return $q.when();
          })
          .catch(handleInviteError);
      };

      this.inviteMethods = {
        'enter': {
          icon: 'ion-ios-compose',
          text: 'Enter someone\'s ID',
          isEnabled: true,
          doInvite: () => {
            let invitePopup = $ionicPopup.show({
              template: `
                <form ng-submit="beginConversationModal.sendInvite()"
                  novalidate>
                <input type="text" placeholder="Your contact's user ID."
                  ng-model="beginConversationModal.contactId" toc-auto-focus>
                </form>
              `,
              title: 'Enter ID',
              scope: $scope,
              buttons: [
                {
                  text: 'Cancel',
                  type: 'button-positive button-block button-outline'
                },
                {
                  text: 'Invite',
                  type: 'button-positive button-block',
                  onTap: (event) => {
                    return this.sendInvite(event);
                  }
                }
              ]
            });
          }
        },
        'scan': {
          icon: 'ion-camera',
          text: 'Scan a picture ID',
          isEnabled: true,
          doInvite: () => {
            let qrScannerPopup = $ionicPopup.show({
              title: 'Scanning ID',
              cssClass: 'toc-id-scanner-popup',
              scope: $scope,
              buttons: [{
                text: 'Cancel',
                type: 'button-positive button-block button-outline'
              }],
              template: `
                <div class="list toc-id-scanner-container">
                  <div class="item item-image toc-id-scanner">
                  </div>
                </div>
              `
            });
            qrScannerPopup
              .then(() => html5Qrcode.stopQrScanner('.toc-id-scanner'));

            // timeout to wait for popup to be created
            $timeout(
              () => html5Qrcode.createQrScanner('.toc-id-scanner')
                .then((qrData) => {
                  let contactId = qrData;
                  if (!identity.validateId(contactId)) {
                    return notifications.notifySystem(
                      `Please enter a valid Toc ID.`
                    );
                  }

                  return contacts.saveSendingInvite(contactId);
                })
                .then(() => {
                  this.removeModal();
                  qrScannerPopup.close();
                  return $q.when();
                })
                .catch(handleInviteError),
            0, false);
          }
        },
        'email': {
          icon: 'ion-email',
          text: 'Send an invite email',
          isEnabled: true,
          doInvite: () => {
            let mailSubject = encodeURIComponent(
              `An invite for Toc Messenger`
            );

            let mailBody = encodeURIComponent(
              'Join me on Toc Messenger!\n' +
              `http://toc.im/?inviteid=${this.userId}\n`
            );

            navigation.openWindow(
              `mailto:?to=&body=${mailBody}&subject=${mailSubject}`
            );

            this.removeModal();
          }
        },
        'share': {
          icon: 'ion-share',
          text: 'Share an invite post',
          isEnabled: true,
          doInvite: () => {
            let modalTemplate = `
              <toc-invite-post-modal class="toc-modal-container"
                remove-modal="beginConversationModal.invitePostModal.remove()">
              </toc-invite-post-modal>
            `;

            let modalName = 'invitePostModal';

            return navigation.showModal(modalName, modalTemplate, this, $scope);
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
            text: 'Done',
            type: 'button-positive button-block'
          }],
          template: `<toc-id-display></toc-id-display>`
        });
      };
    }
  };
}
