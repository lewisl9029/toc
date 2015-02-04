import angular from 'angular';

import contacts from './contacts/contacts';
import storage from './storage/storage';

let services = angular.module('toc.services', [
  contacts.name,
  storage.name
]);

export default services;
