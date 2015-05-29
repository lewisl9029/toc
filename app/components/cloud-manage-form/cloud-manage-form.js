import angular from 'angular';

import directive from './cloud-manage-form-directive';

export default angular.module('toc.components.cloud-manage-form', [])
  .directive(directive.name, directive);
