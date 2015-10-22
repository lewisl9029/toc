import angular from 'angular';

import directive, { directiveName } from './id-display-directive';

export default angular.module('toc.components.id-display', [])
  .directive(directiveName, directive);
