import angular from 'angular';

import buffer from './buffer/buffer';
import channels from './channels/channels';
import contacts from './contacts/contacts';
import cryptography from './cryptography/cryptography';
import devices from './devices/devices';
import identity from './identity/identity';
import messages from './messages/messages';
import navigation from './navigation/navigation';
import network from './network/network';
import notifications from './notifications/notifications';
import session from './session/session';
import state from './state/state';
import status from './status/status';
import storage from './storage/storage';
import time from './time/time';

export default angular.module('toc.services', [
  buffer.name,
  channels.name,
  contacts.name,
  cryptography.name,
  devices.name,
  identity.name,
  messages.name,
  navigation.name,
  network.name,
  notifications.name,
  session.name,
  state.name,
  status.name,
  storage.name,
  time.name
]);
