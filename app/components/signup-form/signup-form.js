import angular from 'angular';

import directive, { directiveName } from './signup-form-directive';

export default angular.module('toc.components.signup-form', [])
  .directive(directiveName, directive);
