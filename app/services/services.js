import angular from 'angular';

import contacts from './contacts/contacts';
import identity from './identity/identity';
import storage from './storage/storage';
import state from './state/state';

export default angular.module('toc.services', [
  contacts.name,
  identity.name,
  storage.name,
  state.name
]);
