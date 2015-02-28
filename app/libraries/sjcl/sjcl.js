import angular from 'angular';

import sjcl from 'bitwiseshiftleft/sjcl';

export default angular.module('toc.libraries.sjcl', [])
  .factory('sjcl', () => sjcl);
