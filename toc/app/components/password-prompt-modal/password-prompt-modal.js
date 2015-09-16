import angular from 'angular';

import directive, { directiveName } from './password-prompt-modal-directive';

export default angular.module('toc.components.password-prompt-modal', [])
  .directive(directiveName, directive);
