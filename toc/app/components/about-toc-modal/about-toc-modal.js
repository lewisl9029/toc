import angular from 'angular';

import directive, { directiveName } from './about-toc-modal-directive';

export default angular.module('toc.components.about-toc-modal', [])
  .directive(directiveName, directive);
