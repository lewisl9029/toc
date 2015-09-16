import angular from 'angular';

import autoFocus from './auto-focus/auto-focus';
import autoSelect from './auto-select/auto-select';
import equalTo from './equal-to/equal-to';
import updateProfileModal from './update-profile-modal/update-profile-modal';
import beginConversationModal from
  './begin-conversation-modal/begin-conversation-modal';
import passwordPromptModal from
  './password-prompt-modal/password-prompt-modal';
import channelCard from './channel-card/channel-card';
import channelList from './channel-list/channel-list';
import cloudConnectModal from './cloud-connect-modal/cloud-connect-modal';
import messageInputArea from './message-input-area/message-input-area';
import messageList from './message-list/message-list';
import notificationCard from './notification-card/notification-card';
import notificationList from './notification-list/notification-list';
import notificationOverlay from './notification-overlay/notification-overlay';
import systemMessageOverlay from
  './system-message-overlay/system-message-overlay';
import qrImage from './qr-image/qr-image';
import conversationsMenu from './conversations-menu/conversations-menu';
import optionsMenu from './options-menu/options-menu';
import spinnerButton from './spinner-button/spinner-button';
import userCard from './user-card/user-card';

export default angular.module('toc.components', [
  autoFocus.name,
  autoSelect.name,
  equalTo.name,
  updateProfileModal.name,
  beginConversationModal.name,
  passwordPromptModal.name,
  channelCard.name,
  channelList.name,
  cloudConnectModal.name,
  messageInputArea.name,
  messageList.name,
  notificationCard.name,
  notificationList.name,
  notificationOverlay.name,
  systemMessageOverlay.name,
  qrImage.name,
  conversationsMenu.name,
  optionsMenu.name,
  spinnerButton.name,
  userCard.name
]);
