import angular from 'angular';

import directive, { directiveName } from './cloud-manage-form-directive';

export default angular.module('toc.components.cloud-manage-form', [])
  .directive(directiveName, directive);
