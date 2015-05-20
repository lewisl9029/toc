import template from './signin.html!text';

export default function configSignin($stateProvider) {
  $stateProvider.state('app.signin', {
    url: '/signin',
    template: template
  });
}
