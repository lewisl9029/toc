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
            $window.open(`http://www.facebook.com/share.php?u=http://toc.im&t=Let\'s talk on Toc Messenger! My ID is ${this.userId}`, '_system');
            this.removeModal();
          }
        },
        'googleplus': {
          icon: 'ion-social-googleplus',
          text: 'Share an invite using Google+',
          isEnabled: true,
          doShare: () => {
            //TODO: add handling of query parameter for auto-invites
            $window.open(`https://plus.google.com/share?url=http://toc.im`, '_system');
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
