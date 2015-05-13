import angular from 'angular';

// import contacts from './contacts/contacts';
import contacts from './contacts/contacts';
import identity from './identity/identity';
import layout from './layout/layout';
import network from './network/network';
import notification from './notification/notification';
import storage from './storage/storage';
import cryptography from './cryptography/cryptography';
import state from './state/state';
import time from './time/time';

export default angular.module('toc.services', [
  // contacts.name,
  contacts.name,
  identity.name,
  layout.name,
  network.name,
  notification.name,
  storage.name,
  cryptography.name,
  state.name,
  time.name
]);
