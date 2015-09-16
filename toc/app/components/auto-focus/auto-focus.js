import angular from 'angular';

import directive, { directiveName } from './auto-focus-directive';

export default angular.module('toc.components.auto-focus', [])
  .directive(directiveName, directive);
