import template from 'app.html!text';

export default function configApp($stateProvider, $urlRouterProvider,
  $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    template: template
  });

  //OAuth token matching
  //http://localhost:8100/#access_token=a4fe6044356f389b512a9bd223816caa&state=%2Fapp%2Fhome
  // $urlRouterProvider.when(/#access_token=/)
  // $stateProvider.state('auth', {
  //   url: '/'
  // });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
}
