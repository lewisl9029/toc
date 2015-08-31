import angular from 'angular';

import directive, { directiveName } from './options-menu-directive';

export default angular.module('toc.components.options-menu', [])
  .directive(directiveName, directive);
