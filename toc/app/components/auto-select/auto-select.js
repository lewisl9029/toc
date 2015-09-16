import angular from 'angular';

import directive, { directiveName } from './auto-select-directive';

export default angular.module('toc.components.auto-select', [])
  .directive(directiveName, directive);
