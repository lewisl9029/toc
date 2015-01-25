import angular from 'angular';

import directive from './signin-form-directive';

let signinForm = angular.module('toc.components.signin-form', [])
  .directive(directive.name, directive);

export default signinForm;
