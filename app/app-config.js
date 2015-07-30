import template from 'app.html!text';
import menuTemplate from 'app-menu.html!text';

export default function configApp($stateProvider, $urlRouterProvider,
  $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.views.transition('android');
  // $ionicConfigProvider.views.maxCache(0);

  $stateProvider.state('app', {
    url: '/app',
    abstract: true
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
