import angular from 'angular';

import directive, { directiveName } from './side-menu-directive';

export default angular.module('toc.components.side-menu', [])
  .directive(directiveName, directive);
