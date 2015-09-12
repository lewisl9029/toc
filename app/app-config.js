import template from 'app.html!text';
import menuTemplate from 'app-menu.html!text';
import controller, { controllerName } from 'app-controller';

export default /*@ngInject*/ function configApp(
  $ionicConfigProvider,
  $logProvider,
  $stateProvider,
  $urlRouterProvider
) {
  $logProvider.debugEnabled(true);

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.views.transition('android');
  $ionicConfigProvider.navBar.alignTitle('center');
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
    controller: controllerName + ' as appView',
    template: menuTemplate
  });
}
