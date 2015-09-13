import angular from 'angular';

import directive, { directiveName } from './system-message-overlay-directive';

export default angular.module('toc.components.system-message-overlay', [])
  .directive(directiveName, directive);
