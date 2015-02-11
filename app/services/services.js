import angular from 'angular';

import contacts from './contacts/contacts';
import storage from './storage/storage';

export default angular.module('toc.services', [
  contacts.name,
  storage.name
]);
