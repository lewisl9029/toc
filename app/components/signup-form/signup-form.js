import angular from 'angular';

import directive from './signup-form-directive';

let signupForm = angular.module('toc.components.signup-form', [])
  .directive(directive.name, directive);

export default signupForm;
