import angular from 'angular';

import th from './telehash-library';

export default angular.module('toc.libraries.telehash', [])
  .factory('telehash', () => telehash);
