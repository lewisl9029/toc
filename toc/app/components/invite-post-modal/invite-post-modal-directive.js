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
      $window,
      navigation,
      state
    ) {
      this.removeModal = $scope.removeModal;

      this.shareMethod = 'email';

      this.userInfo = state.cloud.identity.get().userInfo;
      this.userId = this.userInfo.id;

      this.shareMethods = {
        'facebook': {
          icon: 'ion-social-facebook',
          text: 'Share an invite using Facebook',
          isEnabled: true,
          doShare: () => {
            navigation.openWindow('http://www.facebook.com/share.php?u=' +
            `http://toc.im/?inviteid=${this.userId}`);
            this.removeModal();
          }
        },
        'googleplus': {
          icon: 'ion-social-googleplus',
          text: 'Share an invite using Google+',
          isEnabled: true,
          doShare: () => {
            navigation.openWindow('https://plus.google.com/share?url=' +
            `http://toc.im/?inviteid=${this.userId}`);
            this.removeModal();
          }
        }
      };

      this.doShare = () => {
        this.shareMethods[this.shareMethod].doShare();
      };
    }
  };
}
