import angular from 'angular';

// custom browserify build of telehash v2 that includes all dependencies
// needed because some deps pointed to repositories that are no longer available
//TODO: keep up with telehash v3 development and blockname
import th from './telehash-library';

export default angular.module('toc.libraries.telehash', [])
  .factory('telehash', /*@ngInject*/ () => telehash);
