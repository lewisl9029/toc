import template from 'app.html!text';
import menuTemplate from 'app-menu.html!text';

export default /*@ngInject*/ function configApp(
  $ionicConfigProvider,
  $stateProvider,
  $urlRouterProvider
) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.views.transition('android');
  // $ionicConfigProvider.scrolling.jsScrolling(false);
  // $ionicConfigProvider.views.maxCache(0);

  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    template: '<ion-nav-view></ion-nav-view>'
  });

  $stateProvider.state('app.public', {
    url: '/public',
    abstract: true,
    template: template
  });

  $stateProvider.state('app.private', {
    url: '/private',
    abstract: true,
    template: menuTemplate
  });
}
