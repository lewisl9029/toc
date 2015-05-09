import angular from 'angular';

import forge from 'node-forge';

export default angular.module('toc.libraries.forge', [])
  .factory('forge', () => forge);
