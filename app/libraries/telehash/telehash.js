import angular from 'angular';

import './telehash-library';

export default angular.module('toc.libraries.telehash', [])
  .factory('telehash', () => telehash);
