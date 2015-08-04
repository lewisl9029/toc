import template from './signin.html!text';

export default /*@ngInject*/ function configSignin($stateProvider) {
  $stateProvider.state('app.public.signin', {
    url: '/signin',
    template: template
  });
}
