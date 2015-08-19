import angular from 'angular';

import directive, { directiveName } from './user-card-directive';

export default angular.module('toc.components.user-card', [])
  .directive(directiveName, directive);
