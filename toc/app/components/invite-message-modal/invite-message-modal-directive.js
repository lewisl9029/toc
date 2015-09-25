import template from './invite-message-modal.html!text';

export let directiveName = 'tocInviteMessageModal';
export default /*@ngInject*/ function tocInviteMessageModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      removeModal: '&'
    },
    controllerAs: 'inviteMessageModal',
    controller: /*@ngInject*/ function InviteMessageModalController(
      $scope,
      $window
    ) {
      this.removeModal = $scope.removeModal;

      this.sendMethod = 'email';

      this.sendMethods = {
        'email': {
          icon: 'ion-email',
          text: 'Send an invite using email',
          isEnabled: true,
          doSend: () => {
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

            this.removeModal();
          }
        },
        'facebook': {
          icon: 'ion-share',
          text: 'Send an invite using Facebook Messenger',
          isEnabled: true,
          doSend: () => {

          }
        },
        'skype': {
          icon: 'ion-share',
          text: 'Send an invite using Skype',
          isEnabled: true,
          doSend: () => {

          }
        },
        'whatsapp': {
          icon: 'ion-share',
          text: 'Send an invite using WhatsApp',
          isEnabled: true,
          doSend: () => {

          }
        }
      };

      this.doSend = () => {
        this.sendMethods[this.sendMethod].doSend();
      };
    }
  };
}
