import angular from 'angular';

// import contacts from './contacts/contacts';
import identity from './identity/identity';
import storage from './storage/storage';
import cryptography from './cryptography/cryptography';
import state from './state/state';
import time from './time/time';

export default angular.module('toc.services', [
  // contacts.name,
  identity.name,
  storage.name,
  cryptography.name,
  state.name,
  time.name
]);
