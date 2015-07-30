import template from './signup.html!text';

export default function configSignup($stateProvider) {
  $stateProvider.state('app.public.signup', {
    url: '/signup',
    template: template
  });
}
