import angular from 'angular';

import contacts from 'services/contacts/contacts';

import config from './home-config';
import controller from './home-controller';
import service from './home-service';

let home = angular.module('toc.views.home', [
  contacts.name
]).config(config)
  .controller(controller.name, controller)
  .factory(service.name, service);

export default home;