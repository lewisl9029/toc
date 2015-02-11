import angular from 'angular';

import directive from './signin-form-directive';

export default angular.module('toc.components.signin-form', [])
  .directive(directive.name, directive);
