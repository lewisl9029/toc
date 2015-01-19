import angular from 'angular';

import contacts from './contacts/contacts';

let services = angular.module('toc.services', [
  contacts.name
]);

export default services;
