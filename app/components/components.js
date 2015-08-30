import angular from 'angular';

import autoFocus from './auto-focus/auto-focus';
import autoSelect from './auto-select/auto-select';
import equalTo from './equal-to/equal-to';
import editProfileModal from './edit-profile-modal/edit-profile-modal';
import beginConversationModal from
  './begin-conversation-modal/begin-conversation-modal';
import passwordPromptModal from
  './password-prompt-modal/password-prompt-modal';
import channelCard from './channel-card/channel-card';
import channelList from './channel-list/channel-list';
import cloudConnectForm from './cloud-connect-form/cloud-connect-form';
import cloudManageForm from './cloud-manage-form/cloud-manage-form';
import messageList from './message-list/message-list';
import notificationCard from './notification-card/notification-card';
import notificationList from './notification-list/notification-list';
import notificationOverlay from './notification-overlay/notification-overlay';
import qrImage from './qr-image/qr-image';
import conversationsMenu from './conversations-menu/conversations-menu';
import spinnerButton from './spinner-button/spinner-button';
import userCard from './user-card/user-card';

export default angular.module('toc.components', [
  autoFocus.name,
  autoSelect.name,
  equalTo.name,
  editProfileModal.name,
  beginConversationModal.name,
  passwordPromptModal.name,
  channelCard.name,
  channelList.name,
  cloudConnectForm.name,
  cloudManageForm.name,
  messageList.name,
  notificationCard.name,
  notificationList.name,
  notificationOverlay.name,
  qrImage.name,
  conversationsMenu.name,
  spinnerButton.name,
  userCard.name
]);
