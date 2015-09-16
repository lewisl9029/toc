import angular from 'angular';

import directive, { directiveName } from './qr-image-directive';

export default angular.module('toc.components.qr-image', [])
  .directive(directiveName, directive);
