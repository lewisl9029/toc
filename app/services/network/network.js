import angular from 'angular';

import telehash from 'libraries/telehash/telehash';

import state from 'services/state/state';

import service from './network-service';

export default angular.module('toc.services.network', [
    telehash.name,
    state.name
  ])
  .factory(service.name, service);
