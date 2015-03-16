import angular from 'angular';

import header from './header/header';
import contactList from './contact-list/contact-list';
import signupForm from './signup-form/signup-form';
import signinForm from './signin-form/signin-form';

export default angular.module('toc.components', [
  header.name,
  contactList.name,
  signupForm.name,
  signinForm.name
]);
