import angular from 'angular';

import moment from 'libraries/moment/moment';

import service from './time-service';

export default angular.module('toc.services.time', [
    moment.name
  ])
  .factory(service.name, service);
