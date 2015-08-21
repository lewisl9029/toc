import angular from 'angular';

import directive, { directiveName } from './conversations-menu-directive';

export default angular.module('toc.components.conversations-menu', [])
  .directive(directiveName, directive);
