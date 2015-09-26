import angular from 'angular';

import directive, { directiveName } from './invite-post-modal-directive';

export default angular.module('toc.components.invite-post-modal', [])
  .directive(directiveName, directive);
