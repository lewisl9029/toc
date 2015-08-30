import angular from 'angular';

import directive, { directiveName } from './equal-to-directive';

export default angular.module('toc.components.equal-to', [])
  .directive(directiveName, directive);
