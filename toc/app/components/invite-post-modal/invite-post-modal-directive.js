import template from './invite-post-modal.html!text';

export let directiveName = 'tocInvitePostModal';
export default /*@ngInject*/ function tocInvitePostModal() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      removeModal: '&'
    },
    controllerAs: 'invitePostModal',
    controller: /*@ngInject*/ function InvitePostModalController(
      $scope,
      $window
    ) {
      this.removeModal = $scope.removeModal;

      this.shareMethod = 'email';

      this.shareMethods = {
        'email': {
          icon: 'ion-email',
          text: 'Send an invite using email',
          isEnabled: true,
          doShare: () => {

          }
        },
        'skype': {
          icon: 'ion-share',
          text: 'Share an invite using Skype',
          isEnabled: true,
          doShare: () => {
            $window.open('skype:?chat&topic=test', '_system');
            this.removeModal();
          }
        },
        'whatsapp': {
          icon: 'ion-share',
          text: 'Share an invite using WhatsApp',
          isEnabled: true,
          doShare: () => {

          }
        }
      };

      this.doShare = () => {
        this.shareMethods[this.shareMethod].doShare();
      };
    }
  };
}
