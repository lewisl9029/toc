import angular from 'angular';

import contacts from './contacts/contacts';
import identity from './identity/identity';
import devices from './devices/devices';
import navigation from './navigation/navigation';
import network from './network/network';
import notification from './notification/notification';
import storage from './storage/storage';
import cryptography from './cryptography/cryptography';
import session from './session/session';
import state from './state/state';
import time from './time/time';

export default angular.module('toc.services', [
  contacts.name,
  identity.name,
  devices.name,
  navigation.name,
  network.name,
  notification.name,
  storage.name,
  cryptography.name,
  session.name,
  state.name,
  time.name
]);
