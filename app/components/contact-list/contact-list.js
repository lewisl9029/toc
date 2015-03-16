import angular from 'angular';

import directive from './contact-list-directive';

export default angular.module('toc.components.contact-list', [])
  .directive(directive.name, directive);
