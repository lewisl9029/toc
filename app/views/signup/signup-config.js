import template from './signup.html!text';

export default function configSignup($stateProvider) {
  $stateProvider.state('app.signup', {
    url: '/signup',
    template: template
  });
}
