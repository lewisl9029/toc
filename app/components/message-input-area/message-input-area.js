import angular from 'angular';

import directive, { directiveName } from './message-input-area-directive';

export default angular.module('toc.components.message-input-area', [])
  .directive(directiveName, directive);
