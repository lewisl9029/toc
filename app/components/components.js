import angular from 'angular';

import header from './header/header';
import signupForm from './signup-form/signup-form';
import signinForm from './signin-form/signin-form';

export default angular.module('toc.components', [
  header.name,
  signupForm.name,
  signinForm.name
]);
