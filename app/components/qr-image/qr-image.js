import angular from 'angular';

import directive from './qr-image-directive';

export default angular.module('toc.components.qr-image', [])
  .directive(directive.name, directive);
