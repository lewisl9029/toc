import angular from 'angular';

import directive from './signup-form-directive';

export default angular.module('toc.components.signup-form', [])
  .directive(directive.name, directive);
