import angular from 'angular';

import directive, { directiveName } from './edit-profile-modal-directive';

export default angular.module('toc.components.edit-profile-modal', [])
  .directive(directiveName, directive);
