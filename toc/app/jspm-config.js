System.config({
  baseURL: ".",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "dependencies/github/*",
    "npm:*": "dependencies/npm/*"
  },

  depCache: {
    "app.js": [
      "github:angular/bower-angular@1.4.6",
      "components/components.js",
      "libraries/libraries.js",
      "services/services.js",
      "views/views.js",
      "app-run.js",
      "app-config.js",
      "app-controller.js"
    ],
    "services/services.js": [
      "github:angular/bower-angular@1.4.6",
      "services/buffer/buffer.js",
      "services/channels/channels.js",
      "services/contacts/contacts.js",
      "services/cryptography/cryptography.js",
      "services/devices/devices.js",
      "services/identity/identity.js",
      "services/messages/messages.js",
      "services/navigation/navigation.js",
      "services/network/network.js",
      "services/notifications/notifications.js",
      "services/session/session.js",
      "services/state/state.js",
      "services/status/status.js",
      "services/storage/storage.js",
      "services/time/time.js"
    ],
    "views/views.js": [
      "github:angular/bower-angular@1.4.6",
      "views/channel/channel.js",
      "views/home/home.js",
      "views/welcome/welcome.js"
    ],
    "app-config.js": [
      "app.html!github:systemjs/plugin-text@0.0.2",
      "app-menu.html!github:systemjs/plugin-text@0.0.2",
      "app-controller.js"
    ],
    "libraries/libraries.js": [
      "github:angular/bower-angular@1.4.6",
      "libraries/baobab/baobab.js",
      "libraries/forge/forge.js",
      "libraries/ionic/ionic.js",
      "libraries/moment/moment.js",
      "libraries/ng-cordova/ng-cordova.js",
      "libraries/qr-image/qr-image.js",
      "libraries/ramda/ramda.js",
      "libraries/remote-storage/remote-storage.js",
      "libraries/telehash/telehash.js"
    ],
    "components/components.js": [
      "github:angular/bower-angular@1.4.6",
      "components/auto-focus/auto-focus.js",
      "components/auto-select/auto-select.js",
      "components/equal-to/equal-to.js",
      "components/update-profile-modal/update-profile-modal.js",
      "components/begin-conversation-modal/begin-conversation-modal.js",
      "components/password-prompt-modal/password-prompt-modal.js",
      "components/channel-card/channel-card.js",
      "components/channel-list/channel-list.js",
      "components/cloud-connect-modal/cloud-connect-modal.js",
      "components/message-input-area/message-input-area.js",
      "components/message-list/message-list.js",
      "components/notification-card/notification-card.js",
      "components/notification-list/notification-list.js",
      "components/notification-overlay/notification-overlay.js",
      "components/system-message-overlay/system-message-overlay.js",
      "components/qr-image/qr-image.js",
      "components/conversations-menu/conversations-menu.js",
      "components/options-menu/options-menu.js",
      "components/spinner-button/spinner-button.js",
      "components/user-card/user-card.js"
    ],
    "github:angular/bower-angular@1.4.6": [
      "github:angular/bower-angular@1.4.6/angular"
    ],
    "services/contacts/contacts.js": [
      "github:angular/bower-angular@1.4.6",
      "services/contacts/contacts-service.js"
    ],
    "services/channels/channels.js": [
      "github:angular/bower-angular@1.4.6",
      "services/channels/channels-service.js"
    ],
    "services/devices/devices.js": [
      "github:angular/bower-angular@1.4.6",
      "services/devices/devices-service.js"
    ],
    "services/navigation/navigation.js": [
      "github:angular/bower-angular@1.4.6",
      "services/navigation/navigation-service.js"
    ],
    "services/network/network.js": [
      "github:angular/bower-angular@1.4.6",
      "services/network/network-service.js"
    ],
    "services/state/state.js": [
      "github:angular/bower-angular@1.4.6",
      "services/state/state-service.js"
    ],
    "services/status/status.js": [
      "github:angular/bower-angular@1.4.6",
      "services/status/status-service.js"
    ],
    "services/session/session.js": [
      "github:angular/bower-angular@1.4.6",
      "services/session/session-service.js"
    ],
    "services/time/time.js": [
      "github:angular/bower-angular@1.4.6",
      "services/time/time-service.js"
    ],
    "views/home/home.js": [
      "github:angular/bower-angular@1.4.6",
      "views/home/home-config.js",
      "views/home/home-controller.js"
    ],
    "views/welcome/welcome.js": [
      "github:angular/bower-angular@1.4.6",
      "views/welcome/welcome-config.js",
      "views/welcome/welcome-controller.js"
    ],
    "services/buffer/buffer.js": [
      "github:angular/bower-angular@1.4.6",
      "services/buffer/buffer-service.js"
    ],
    "services/messages/messages.js": [
      "github:angular/bower-angular@1.4.6",
      "services/messages/messages-service.js"
    ],
    "services/storage/storage.js": [
      "github:angular/bower-angular@1.4.6",
      "services/storage/storage-service.js"
    ],
    "services/cryptography/cryptography.js": [
      "github:angular/bower-angular@1.4.6",
      "services/cryptography/cryptography-service.js"
    ],
    "libraries/baobab/baobab.js": [
      "github:angular/bower-angular@1.4.6",
      "npm:baobab@2.0.0-rc2"
    ],
    "services/notifications/notifications.js": [
      "github:angular/bower-angular@1.4.6",
      "services/notifications/notifications-service.js"
    ],
    "libraries/ionic/ionic.js": [
      "github:angular/bower-angular@1.4.6",
      "libraries/ionic/ionic-angular-library.js"
    ],
    "libraries/moment/moment.js": [
      "github:angular/bower-angular@1.4.6",
      "npm:moment@2.10.6"
    ],
    "services/identity/identity.js": [
      "github:angular/bower-angular@1.4.6",
      "services/identity/identity-service.js"
    ],
    "views/channel/channel.js": [
      "github:angular/bower-angular@1.4.6",
      "views/channel/channel-config.js",
      "views/channel/channel-controller.js"
    ],
    "libraries/ramda/ramda.js": [
      "github:angular/bower-angular@1.4.6",
      "npm:ramda@0.17.1"
    ],
    "libraries/forge/forge.js": [
      "github:angular/bower-angular@1.4.6",
      "npm:node-forge@0.6.34"
    ],
    "libraries/remote-storage/remote-storage.js": [
      "github:angular/bower-angular@1.4.6",
      "libraries/remote-storage/remote-storage-library.js"
    ],
    "libraries/telehash/telehash.js": [
      "github:angular/bower-angular@1.4.6",
      "libraries/telehash/telehash-library.js"
    ],
    "components/auto-select/auto-select.js": [
      "github:angular/bower-angular@1.4.6",
      "components/auto-select/auto-select-directive.js"
    ],
    "components/equal-to/equal-to.js": [
      "github:angular/bower-angular@1.4.6",
      "components/equal-to/equal-to-directive.js"
    ],
    "components/update-profile-modal/update-profile-modal.js": [
      "github:angular/bower-angular@1.4.6",
      "components/update-profile-modal/update-profile-modal-directive.js"
    ],
    "components/begin-conversation-modal/begin-conversation-modal.js": [
      "github:angular/bower-angular@1.4.6",
      "components/begin-conversation-modal/begin-conversation-modal-directive.js"
    ],
    "libraries/ng-cordova/ng-cordova.js": [
      "github:angular/bower-angular@1.4.6",
      "npm:ng-cordova@0.1.17-alpha"
    ],
    "components/channel-card/channel-card.js": [
      "github:angular/bower-angular@1.4.6",
      "components/channel-card/channel-card-directive.js"
    ],
    "components/channel-list/channel-list.js": [
      "github:angular/bower-angular@1.4.6",
      "components/channel-list/channel-list-directive.js"
    ],
    "libraries/qr-image/qr-image.js": [
      "github:angular/bower-angular@1.4.6",
      "npm:qr-image@3.1.0"
    ],
    "components/cloud-connect-modal/cloud-connect-modal.js": [
      "github:angular/bower-angular@1.4.6",
      "components/cloud-connect-modal/cloud-connect-modal-directive.js"
    ],
    "components/message-list/message-list.js": [
      "github:angular/bower-angular@1.4.6",
      "components/message-list/message-list-directive.js"
    ],
    "components/notification-card/notification-card.js": [
      "github:angular/bower-angular@1.4.6",
      "components/notification-card/notification-card-directive.js"
    ],
    "components/notification-overlay/notification-overlay.js": [
      "github:angular/bower-angular@1.4.6",
      "components/notification-overlay/notification-overlay-directive.js"
    ],
    "components/notification-list/notification-list.js": [
      "github:angular/bower-angular@1.4.6",
      "components/notification-list/notification-list-directive.js"
    ],
    "components/system-message-overlay/system-message-overlay.js": [
      "github:angular/bower-angular@1.4.6",
      "components/system-message-overlay/system-message-overlay-directive.js"
    ],
    "components/auto-focus/auto-focus.js": [
      "github:angular/bower-angular@1.4.6",
      "components/auto-focus/auto-focus-directive.js"
    ],
    "components/user-card/user-card.js": [
      "github:angular/bower-angular@1.4.6",
      "components/user-card/user-card-directive.js"
    ],
    "components/options-menu/options-menu.js": [
      "github:angular/bower-angular@1.4.6",
      "components/options-menu/options-menu-directive.js"
    ],
    "components/message-input-area/message-input-area.js": [
      "github:angular/bower-angular@1.4.6",
      "components/message-input-area/message-input-area-directive.js"
    ],
    "components/spinner-button/spinner-button.js": [
      "github:angular/bower-angular@1.4.6",
      "components/spinner-button/spinner-button-directive.js"
    ],
    "components/qr-image/qr-image.js": [
      "github:angular/bower-angular@1.4.6",
      "components/qr-image/qr-image-directive.js"
    ],
    "components/password-prompt-modal/password-prompt-modal.js": [
      "github:angular/bower-angular@1.4.6",
      "components/password-prompt-modal/password-prompt-modal-directive.js"
    ],
    "components/conversations-menu/conversations-menu.js": [
      "github:angular/bower-angular@1.4.6",
      "components/conversations-menu/conversations-menu-directive.js"
    ],
    "views/home/home-config.js": [
      "views/home/home.html!github:systemjs/plugin-text@0.0.2",
      "views/home/home-controller.js"
    ],
    "views/welcome/welcome-config.js": [
      "views/welcome/welcome.html!github:systemjs/plugin-text@0.0.2",
      "views/welcome/welcome-controller.js"
    ],
    "npm:baobab@2.0.0-rc2": [
      "npm:baobab@2.0.0-rc2/dist/baobab"
    ],
    "views/channel/channel-config.js": [
      "views/channel/channel.html!github:systemjs/plugin-text@0.0.2",
      "views/channel/channel-controller.js"
    ],
    "npm:node-forge@0.6.34": [
      "npm:node-forge@0.6.34/js/forge"
    ],
    "components/update-profile-modal/update-profile-modal-directive.js": [
      "components/update-profile-modal/update-profile-modal.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/begin-conversation-modal/begin-conversation-modal-directive.js": [
      "components/begin-conversation-modal/begin-conversation-modal.html!github:systemjs/plugin-text@0.0.2"
    ],
    "npm:ng-cordova@0.1.17-alpha": [
      "npm:ng-cordova@0.1.17-alpha/dist/ng-cordova"
    ],
    "components/channel-card/channel-card-directive.js": [
      "components/channel-card/channel-card.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/channel-list/channel-list-directive.js": [
      "components/channel-list/channel-list.html!github:systemjs/plugin-text@0.0.2"
    ],
    "npm:moment@2.10.6": [
      "npm:moment@2.10.6/moment"
    ],
    "components/cloud-connect-modal/cloud-connect-modal-directive.js": [
      "components/cloud-connect-modal/cloud-connect-modal.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/message-list/message-list-directive.js": [
      "components/message-list/message-list.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/notification-card/notification-card-directive.js": [
      "components/notification-card/notification-card.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/notification-overlay/notification-overlay-directive.js": [
      "components/notification-overlay/notification-overlay.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/notification-list/notification-list-directive.js": [
      "components/notification-list/notification-list.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/system-message-overlay/system-message-overlay-directive.js": [
      "components/system-message-overlay/system-message-overlay.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/user-card/user-card-directive.js": [
      "components/user-card/user-card.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/options-menu/options-menu-directive.js": [
      "components/options-menu/options-menu.html!github:systemjs/plugin-text@0.0.2"
    ],
    "libraries/ionic/ionic-angular-library.js": [
      "libraries/ionic/ionic-library.js",
      "github:angular/bower-angular@1.4.6",
      "github:angular/bower-angular-animate@1.4.6",
      "github:angular/bower-angular-sanitize@1.4.6",
      "github:angular-ui/ui-router@0.2.15"
    ],
    "npm:qr-image@3.1.0": [
      "npm:qr-image@3.1.0/lib/qr"
    ],
    "npm:ramda@0.17.1": [
      "npm:ramda@0.17.1/dist/ramda"
    ],
    "components/message-input-area/message-input-area-directive.js": [
      "components/message-input-area/message-input-area.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/password-prompt-modal/password-prompt-modal-directive.js": [
      "components/password-prompt-modal/password-prompt-modal.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/conversations-menu/conversations-menu-directive.js": [
      "components/conversations-menu/conversations-menu.html!github:systemjs/plugin-text@0.0.2"
    ],
    "npm:baobab@2.0.0-rc2/dist/baobab": [
      "npm:emmett@3.1.1",
      "npm:baobab@2.0.0-rc2/dist/cursor",
      "npm:baobab@2.0.0-rc2/dist/monkey",
      "npm:baobab@2.0.0-rc2/dist/watcher",
      "npm:baobab@2.0.0-rc2/dist/type",
      "npm:baobab@2.0.0-rc2/dist/update",
      "npm:baobab@2.0.0-rc2/dist/helpers"
    ],
    "npm:node-forge@0.6.34/js/forge": [
      "npm:node-forge@0.6.34/js/aes",
      "npm:node-forge@0.6.34/js/aesCipherSuites",
      "npm:node-forge@0.6.34/js/asn1",
      "npm:node-forge@0.6.34/js/cipher",
      "npm:node-forge@0.6.34/js/cipherModes",
      "npm:node-forge@0.6.34/js/debug",
      "npm:node-forge@0.6.34/js/des",
      "npm:node-forge@0.6.34/js/hmac",
      "npm:node-forge@0.6.34/js/kem",
      "npm:node-forge@0.6.34/js/log",
      "npm:node-forge@0.6.34/js/md",
      "npm:node-forge@0.6.34/js/mgf1",
      "npm:node-forge@0.6.34/js/pbkdf2",
      "npm:node-forge@0.6.34/js/pem",
      "npm:node-forge@0.6.34/js/pkcs7",
      "npm:node-forge@0.6.34/js/pkcs1",
      "npm:node-forge@0.6.34/js/pkcs12",
      "npm:node-forge@0.6.34/js/pki",
      "npm:node-forge@0.6.34/js/prime",
      "npm:node-forge@0.6.34/js/prng",
      "npm:node-forge@0.6.34/js/pss",
      "npm:node-forge@0.6.34/js/random",
      "npm:node-forge@0.6.34/js/rc2",
      "npm:node-forge@0.6.34/js/ssh",
      "npm:node-forge@0.6.34/js/task",
      "npm:node-forge@0.6.34/js/tls",
      "npm:node-forge@0.6.34/js/util"
    ],
    "github:angular/bower-angular-animate@1.4.6": [
      "github:angular/bower-angular-animate@1.4.6/angular-animate"
    ],
    "github:angular/bower-angular-sanitize@1.4.6": [
      "github:angular/bower-angular-sanitize@1.4.6/angular-sanitize"
    ],
    "github:angular-ui/ui-router@0.2.15": [
      "github:angular-ui/ui-router@0.2.15/angular-ui-router"
    ],
    "npm:qr-image@3.1.0/lib/qr": [
      "github:jspm/nodelibs-stream@0.1.0",
      "npm:qr-image@3.1.0/lib/qr-base",
      "npm:qr-image@3.1.0/lib/png",
      "npm:qr-image@3.1.0/lib/vector",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:ramda@0.17.1/dist/ramda": [
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:ng-cordova@0.1.17-alpha/dist/ng-cordova": [
      "github:angular/bower-angular@1.4.6"
    ],
    "npm:baobab@2.0.0-rc2/dist/cursor": [
      "npm:emmett@3.1.1",
      "npm:baobab@2.0.0-rc2/dist/monkey",
      "npm:baobab@2.0.0-rc2/dist/type",
      "npm:baobab@2.0.0-rc2/dist/helpers"
    ],
    "npm:baobab@2.0.0-rc2/dist/monkey": [
      "npm:baobab@2.0.0-rc2/dist/type",
      "npm:baobab@2.0.0-rc2/dist/update",
      "npm:baobab@2.0.0-rc2/dist/helpers"
    ],
    "npm:baobab@2.0.0-rc2/dist/watcher": [
      "npm:emmett@3.1.1",
      "npm:baobab@2.0.0-rc2/dist/cursor",
      "npm:baobab@2.0.0-rc2/dist/type",
      "npm:baobab@2.0.0-rc2/dist/helpers"
    ],
    "npm:baobab@2.0.0-rc2/dist/type": [
      "npm:baobab@2.0.0-rc2/dist/monkey"
    ],
    "npm:baobab@2.0.0-rc2/dist/update": [
      "npm:baobab@2.0.0-rc2/dist/type",
      "npm:baobab@2.0.0-rc2/dist/helpers"
    ],
    "npm:baobab@2.0.0-rc2/dist/helpers": [
      "npm:baobab@2.0.0-rc2/dist/monkey",
      "npm:baobab@2.0.0-rc2/dist/type"
    ],
    "npm:node-forge@0.6.34/js/aes": [
      "npm:node-forge@0.6.34/js/cipher",
      "npm:node-forge@0.6.34/js/cipherModes",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/aesCipherSuites": [
      "npm:node-forge@0.6.34/js/aes",
      "npm:node-forge@0.6.34/js/tls"
    ],
    "npm:node-forge@0.6.34/js/asn1": [
      "npm:node-forge@0.6.34/js/util",
      "npm:node-forge@0.6.34/js/oids"
    ],
    "npm:node-forge@0.6.34/js/cipher": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/cipherModes": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/des": [
      "npm:node-forge@0.6.34/js/cipher",
      "npm:node-forge@0.6.34/js/cipherModes",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/hmac": [
      "npm:node-forge@0.6.34/js/md",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/kem": [
      "npm:node-forge@0.6.34/js/util",
      "npm:node-forge@0.6.34/js/random",
      "npm:node-forge@0.6.34/js/jsbn"
    ],
    "npm:node-forge@0.6.34/js/md": [
      "npm:node-forge@0.6.34/js/md5",
      "npm:node-forge@0.6.34/js/sha1",
      "npm:node-forge@0.6.34/js/sha256",
      "npm:node-forge@0.6.34/js/sha512"
    ],
    "npm:node-forge@0.6.34/js/mgf1": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/pbkdf2": [
      "npm:node-forge@0.6.34/js/hmac",
      "npm:node-forge@0.6.34/js/md",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/pkcs1": [
      "npm:node-forge@0.6.34/js/util",
      "npm:node-forge@0.6.34/js/random",
      "npm:node-forge@0.6.34/js/sha1"
    ],
    "npm:node-forge@0.6.34/js/prime": [
      "npm:node-forge@0.6.34/js/util",
      "npm:node-forge@0.6.34/js/jsbn",
      "npm:node-forge@0.6.34/js/random"
    ],
    "npm:node-forge@0.6.34/js/prng": [
      "npm:node-forge@0.6.34/js/md",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/pkcs12": [
      "npm:node-forge@0.6.34/js/asn1",
      "npm:node-forge@0.6.34/js/hmac",
      "npm:node-forge@0.6.34/js/oids",
      "npm:node-forge@0.6.34/js/pkcs7asn1",
      "npm:node-forge@0.6.34/js/pbe",
      "npm:node-forge@0.6.34/js/random",
      "npm:node-forge@0.6.34/js/rsa",
      "npm:node-forge@0.6.34/js/sha1",
      "npm:node-forge@0.6.34/js/util",
      "npm:node-forge@0.6.34/js/x509"
    ],
    "npm:node-forge@0.6.34/js/rc2": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/log": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/task": [
      "npm:node-forge@0.6.34/js/debug",
      "npm:node-forge@0.6.34/js/log",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/pss": [
      "npm:node-forge@0.6.34/js/random",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/pem": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/ssh": [
      "npm:node-forge@0.6.34/js/aes",
      "npm:node-forge@0.6.34/js/hmac",
      "npm:node-forge@0.6.34/js/md5",
      "npm:node-forge@0.6.34/js/sha1",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/random": [
      "npm:node-forge@0.6.34/js/aes",
      "npm:node-forge@0.6.34/js/md",
      "npm:node-forge@0.6.34/js/prng",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/pkcs7": [
      "npm:node-forge@0.6.34/js/aes",
      "npm:node-forge@0.6.34/js/asn1",
      "npm:node-forge@0.6.34/js/des",
      "npm:node-forge@0.6.34/js/oids",
      "npm:node-forge@0.6.34/js/pem",
      "npm:node-forge@0.6.34/js/pkcs7asn1",
      "npm:node-forge@0.6.34/js/random",
      "npm:node-forge@0.6.34/js/util",
      "npm:node-forge@0.6.34/js/x509"
    ],
    "github:angular/bower-angular-sanitize@1.4.6/angular-sanitize": [
      "github:angular/bower-angular@1.4.6"
    ],
    "github:jspm/nodelibs-stream@0.1.0": [
      "github:jspm/nodelibs-stream@0.1.0/index"
    ],
    "github:jspm/nodelibs-process@0.1.1": [
      "github:jspm/nodelibs-process@0.1.1/index"
    ],
    "npm:qr-image@3.1.0/lib/qr-base": [
      "npm:qr-image@3.1.0/lib/encode",
      "npm:qr-image@3.1.0/lib/errorcode",
      "npm:qr-image@3.1.0/lib/matrix",
      "github:jspm/nodelibs-buffer@0.1.0"
    ],
    "npm:qr-image@3.1.0/lib/png": [
      "npm:qr-image@3.1.0/lib/crc32",
      "github:jspm/nodelibs-zlib@0.1.0",
      "npm:pako@0.2.8",
      "github:jspm/nodelibs-buffer@0.1.0"
    ],
    "github:angular/bower-angular-animate@1.4.6/angular-animate": [
      "github:angular/bower-angular@1.4.6"
    ],
    "npm:node-forge@0.6.34/js/tls": [
      "npm:node-forge@0.6.34/js/asn1",
      "npm:node-forge@0.6.34/js/hmac",
      "npm:node-forge@0.6.34/js/md",
      "npm:node-forge@0.6.34/js/pem",
      "npm:node-forge@0.6.34/js/pki",
      "npm:node-forge@0.6.34/js/random",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:emmett@3.1.1": [
      "npm:emmett@3.1.1/emmett"
    ],
    "npm:node-forge@0.6.34/js/pki": [
      "npm:node-forge@0.6.34/js/asn1",
      "npm:node-forge@0.6.34/js/oids",
      "npm:node-forge@0.6.34/js/pbe",
      "npm:node-forge@0.6.34/js/pem",
      "npm:node-forge@0.6.34/js/pbkdf2",
      "npm:node-forge@0.6.34/js/pkcs12",
      "npm:node-forge@0.6.34/js/pss",
      "npm:node-forge@0.6.34/js/rsa",
      "npm:node-forge@0.6.34/js/util",
      "npm:node-forge@0.6.34/js/x509"
    ],
    "github:angular-ui/ui-router@0.2.15/angular-ui-router": [
      "github:angular/bower-angular@1.4.6"
    ],
    "npm:node-forge@0.6.34/js/md5": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/sha1": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/sha512": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/pbe": [
      "npm:node-forge@0.6.34/js/aes",
      "npm:node-forge@0.6.34/js/asn1",
      "npm:node-forge@0.6.34/js/des",
      "npm:node-forge@0.6.34/js/md",
      "npm:node-forge@0.6.34/js/oids",
      "npm:node-forge@0.6.34/js/pem",
      "npm:node-forge@0.6.34/js/pbkdf2",
      "npm:node-forge@0.6.34/js/random",
      "npm:node-forge@0.6.34/js/rc2",
      "npm:node-forge@0.6.34/js/rsa",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/pkcs7asn1": [
      "npm:node-forge@0.6.34/js/asn1",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:node-forge@0.6.34/js/rsa": [
      "npm:node-forge@0.6.34/js/asn1",
      "npm:node-forge@0.6.34/js/jsbn",
      "npm:node-forge@0.6.34/js/oids",
      "npm:node-forge@0.6.34/js/pkcs1",
      "npm:node-forge@0.6.34/js/prime",
      "npm:node-forge@0.6.34/js/random",
      "npm:node-forge@0.6.34/js/util"
    ],
    "github:jspm/nodelibs-stream@0.1.0/index": [
      "npm:stream-browserify@1.0.0"
    ],
    "github:jspm/nodelibs-process@0.1.1/index": [
      "npm:process@0.10.1"
    ],
    "github:jspm/nodelibs-buffer@0.1.0": [
      "github:jspm/nodelibs-buffer@0.1.0/index"
    ],
    "npm:qr-image@3.1.0/lib/encode": [
      "github:jspm/nodelibs-buffer@0.1.0"
    ],
    "npm:qr-image@3.1.0/lib/errorcode": [
      "github:jspm/nodelibs-buffer@0.1.0"
    ],
    "npm:node-forge@0.6.34/js/sha256": [
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:qr-image@3.1.0/lib/matrix": [
      "github:jspm/nodelibs-buffer@0.1.0"
    ],
    "github:jspm/nodelibs-zlib@0.1.0": [
      "github:jspm/nodelibs-zlib@0.1.0/index"
    ],
    "npm:pako@0.2.8": [
      "npm:pako@0.2.8/index"
    ],
    "npm:qr-image@3.1.0/lib/crc32": [
      "npm:qr-image@3.1.0/lib/crc32buffer",
      "github:jspm/nodelibs-buffer@0.1.0",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:node-forge@0.6.34/js/x509": [
      "npm:node-forge@0.6.34/js/aes",
      "npm:node-forge@0.6.34/js/asn1",
      "npm:node-forge@0.6.34/js/des",
      "npm:node-forge@0.6.34/js/md",
      "npm:node-forge@0.6.34/js/mgf",
      "npm:node-forge@0.6.34/js/oids",
      "npm:node-forge@0.6.34/js/pem",
      "npm:node-forge@0.6.34/js/pss",
      "npm:node-forge@0.6.34/js/rsa",
      "npm:node-forge@0.6.34/js/util"
    ],
    "npm:stream-browserify@1.0.0": [
      "npm:stream-browserify@1.0.0/index"
    ],
    "npm:process@0.10.1": [
      "npm:process@0.10.1/browser"
    ],
    "github:jspm/nodelibs-buffer@0.1.0/index": [
      "npm:buffer@3.5.0"
    ],
    "github:jspm/nodelibs-zlib@0.1.0/index": [
      "npm:browserify-zlib@0.1.4"
    ],
    "npm:pako@0.2.8/index": [
      "npm:pako@0.2.8/lib/utils/common",
      "npm:pako@0.2.8/lib/deflate",
      "npm:pako@0.2.8/lib/inflate",
      "npm:pako@0.2.8/lib/zlib/constants"
    ],
    "npm:qr-image@3.1.0/lib/crc32buffer": [
      "github:jspm/nodelibs-buffer@0.1.0"
    ],
    "npm:node-forge@0.6.34/js/mgf": [
      "npm:node-forge@0.6.34/js/mgf1"
    ],
    "npm:stream-browserify@1.0.0/index": [
      "github:jspm/nodelibs-events@0.1.1",
      "npm:inherits@2.0.1",
      "npm:readable-stream@1.1.13/readable",
      "npm:readable-stream@1.1.13/writable",
      "npm:readable-stream@1.1.13/duplex",
      "npm:readable-stream@1.1.13/transform",
      "npm:readable-stream@1.1.13/passthrough"
    ],
    "npm:buffer@3.5.0": [
      "npm:buffer@3.5.0/index"
    ],
    "npm:browserify-zlib@0.1.4": [
      "npm:browserify-zlib@0.1.4/src/index"
    ],
    "npm:pako@0.2.8/lib/deflate": [
      "npm:pako@0.2.8/lib/zlib/deflate",
      "npm:pako@0.2.8/lib/utils/common",
      "npm:pako@0.2.8/lib/utils/strings",
      "npm:pako@0.2.8/lib/zlib/messages",
      "npm:pako@0.2.8/lib/zlib/zstream"
    ],
    "npm:pako@0.2.8/lib/inflate": [
      "npm:pako@0.2.8/lib/zlib/inflate",
      "npm:pako@0.2.8/lib/utils/common",
      "npm:pako@0.2.8/lib/utils/strings",
      "npm:pako@0.2.8/lib/zlib/constants",
      "npm:pako@0.2.8/lib/zlib/messages",
      "npm:pako@0.2.8/lib/zlib/zstream",
      "npm:pako@0.2.8/lib/zlib/gzheader",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:inherits@2.0.1": [
      "npm:inherits@2.0.1/inherits_browser"
    ],
    "npm:readable-stream@1.1.13/readable": [
      "npm:readable-stream@1.1.13/lib/_stream_readable",
      "npm:stream-browserify@1.0.0/index",
      "npm:readable-stream@1.1.13/lib/_stream_writable",
      "npm:readable-stream@1.1.13/lib/_stream_duplex",
      "npm:readable-stream@1.1.13/lib/_stream_transform",
      "npm:readable-stream@1.1.13/lib/_stream_passthrough"
    ],
    "npm:readable-stream@1.1.13/writable": [
      "npm:readable-stream@1.1.13/lib/_stream_writable"
    ],
    "npm:readable-stream@1.1.13/duplex": [
      "npm:readable-stream@1.1.13/lib/_stream_duplex"
    ],
    "npm:readable-stream@1.1.13/transform": [
      "npm:readable-stream@1.1.13/lib/_stream_transform"
    ],
    "npm:readable-stream@1.1.13/passthrough": [
      "npm:readable-stream@1.1.13/lib/_stream_passthrough"
    ],
    "npm:buffer@3.5.0/index": [
      "npm:base64-js@0.0.8",
      "npm:ieee754@1.1.6",
      "npm:is-array@1.0.1"
    ],
    "npm:pako@0.2.8/lib/zlib/deflate": [
      "npm:pako@0.2.8/lib/utils/common",
      "npm:pako@0.2.8/lib/zlib/trees",
      "npm:pako@0.2.8/lib/zlib/adler32",
      "npm:pako@0.2.8/lib/zlib/crc32",
      "npm:pako@0.2.8/lib/zlib/messages",
      "github:jspm/nodelibs-buffer@0.1.0"
    ],
    "npm:pako@0.2.8/lib/utils/strings": [
      "npm:pako@0.2.8/lib/utils/common",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "github:jspm/nodelibs-events@0.1.1": [
      "github:jspm/nodelibs-events@0.1.1/index"
    ],
    "npm:browserify-zlib@0.1.4/src/index": [
      "npm:readable-stream@1.1.13/transform",
      "npm:browserify-zlib@0.1.4/src/binding",
      "github:jspm/nodelibs-util@0.1.0",
      "github:jspm/nodelibs-assert@0.1.0",
      "github:jspm/nodelibs-buffer@0.1.0",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:pako@0.2.8/lib/zlib/inflate": [
      "npm:pako@0.2.8/lib/utils/common",
      "npm:pako@0.2.8/lib/zlib/adler32",
      "npm:pako@0.2.8/lib/zlib/crc32",
      "npm:pako@0.2.8/lib/zlib/inffast",
      "npm:pako@0.2.8/lib/zlib/inftrees",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:readable-stream@1.1.13/lib/_stream_readable": [
      "npm:isarray@0.0.1",
      "github:jspm/nodelibs-buffer@0.1.0",
      "github:jspm/nodelibs-events@0.1.1",
      "npm:stream-browserify@1.0.0/index",
      "npm:core-util-is@1.0.1",
      "npm:inherits@2.0.1",
      "@empty",
      "npm:readable-stream@1.1.13/lib/_stream_duplex",
      "npm:string_decoder@0.10.31",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:readable-stream@1.1.13/lib/_stream_writable": [
      "github:jspm/nodelibs-buffer@0.1.0",
      "npm:core-util-is@1.0.1",
      "npm:inherits@2.0.1",
      "npm:stream-browserify@1.0.0/index",
      "npm:readable-stream@1.1.13/lib/_stream_duplex",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:readable-stream@1.1.13/lib/_stream_duplex": [
      "npm:core-util-is@1.0.1",
      "npm:inherits@2.0.1",
      "npm:readable-stream@1.1.13/lib/_stream_readable",
      "npm:readable-stream@1.1.13/lib/_stream_writable",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:readable-stream@1.1.13/lib/_stream_transform": [
      "npm:readable-stream@1.1.13/lib/_stream_duplex",
      "npm:core-util-is@1.0.1",
      "npm:inherits@2.0.1",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:readable-stream@1.1.13/lib/_stream_passthrough": [
      "npm:readable-stream@1.1.13/lib/_stream_transform",
      "npm:core-util-is@1.0.1",
      "npm:inherits@2.0.1"
    ],
    "npm:base64-js@0.0.8": [
      "npm:base64-js@0.0.8/lib/b64"
    ],
    "npm:ieee754@1.1.6": [
      "npm:ieee754@1.1.6/index"
    ],
    "npm:is-array@1.0.1": [
      "npm:is-array@1.0.1/index"
    ],
    "npm:pako@0.2.8/lib/zlib/trees": [
      "npm:pako@0.2.8/lib/utils/common",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "github:jspm/nodelibs-events@0.1.1/index": [
      "npm:events@1.0.2"
    ],
    "github:jspm/nodelibs-util@0.1.0": [
      "github:jspm/nodelibs-util@0.1.0/index"
    ],
    "github:jspm/nodelibs-assert@0.1.0": [
      "github:jspm/nodelibs-assert@0.1.0/index"
    ],
    "npm:browserify-zlib@0.1.4/src/binding": [
      "npm:pako@0.2.8/lib/zlib/messages",
      "npm:pako@0.2.8/lib/zlib/zstream",
      "npm:pako@0.2.8/lib/zlib/deflate",
      "npm:pako@0.2.8/lib/zlib/inflate",
      "npm:pako@0.2.8/lib/zlib/constants",
      "github:jspm/nodelibs-buffer@0.1.0",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:pako@0.2.8/lib/zlib/inftrees": [
      "npm:pako@0.2.8/lib/utils/common",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:isarray@0.0.1": [
      "npm:isarray@0.0.1/index"
    ],
    "npm:core-util-is@1.0.1": [
      "npm:core-util-is@1.0.1/lib/util"
    ],
    "npm:string_decoder@0.10.31": [
      "npm:string_decoder@0.10.31/index"
    ],
    "npm:events@1.0.2": [
      "npm:events@1.0.2/events"
    ],
    "github:jspm/nodelibs-util@0.1.0/index": [
      "npm:util@0.10.3"
    ],
    "github:jspm/nodelibs-assert@0.1.0/index": [
      "npm:assert@1.3.0"
    ],
    "npm:core-util-is@1.0.1/lib/util": [
      "github:jspm/nodelibs-buffer@0.1.0"
    ],
    "npm:string_decoder@0.10.31/index": [
      "github:jspm/nodelibs-buffer@0.1.0"
    ],
    "npm:util@0.10.3": [
      "npm:util@0.10.3/util"
    ],
    "npm:assert@1.3.0": [
      "npm:assert@1.3.0/assert"
    ],
    "npm:util@0.10.3/util": [
      "npm:util@0.10.3/support/isBufferBrowser",
      "npm:inherits@2.0.1",
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:assert@1.3.0/assert": [
      "npm:util@0.10.3"
    ]
  },

  map: {
    "angular": "github:angular/bower-angular@1.4.6",
    "angular-animate": "github:angular/bower-angular-animate@1.4.6",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.4.6",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.15",
    "angular/bower-angular": "github:angular/bower-angular@1.4.6",
    "babel": "npm:babel-core@5.8.24",
    "babel-runtime": "npm:babel-runtime@5.8.24",
    "baobab": "npm:baobab@2.0.0-rc2",
    "core-js": "npm:core-js@1.1.4",
    "driftyco/ionic": "github:driftyco/ionic@1.1.0",
    "moment": "npm:moment@2.10.6",
    "ng-cordova": "npm:ng-cordova@0.1.17-alpha",
    "node-forge": "npm:node-forge@0.6.34",
    "plugin-text": "github:systemjs/plugin-text@0.0.2",
    "qr-image": "npm:qr-image@3.1.0",
    "ramda": "npm:ramda@0.17.1",
    "remotestoragejs": "npm:remotestoragejs@0.11.2",
    "text": "github:systemjs/plugin-text@0.0.2",
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.6"
    },
    "github:angular/bower-angular-animate@1.4.6": {
      "angular": "github:angular/bower-angular@1.4.6"
    },
    "github:angular/bower-angular-sanitize@1.4.6": {
      "angular": "github:angular/bower-angular@1.4.6"
    },
    "github:driftyco/ionic@1.1.0": {
      "angular": "github:angular/bower-angular@1.4.6",
      "angular-animate": "github:angular/bower-angular-animate@1.4.6",
      "angular-sanitize": "github:angular/bower-angular-sanitize@1.4.6",
      "angular-ui-router": "github:angular-ui/ui-router@0.2.15"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.5.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-zlib@0.1.0": {
      "browserify-zlib": "npm:browserify-zlib@0.1.4"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.24": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:baobab@2.0.0-rc2": {
      "emmett": "npm:emmett@3.1.1"
    },
    "npm:browserify-zlib@0.1.4": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "pako": "npm:pako@0.2.8",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "readable-stream": "npm:readable-stream@1.1.13",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:buffer@3.5.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.6",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:conventional-changelog@0.0.11": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "event-stream": "npm:event-stream@3.1.7",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "lodash.assign": "npm:lodash.assign@2.4.1",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:core-js@1.1.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:duplexer@0.1.1": {
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:event-stream@3.1.7": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "duplexer": "npm:duplexer@0.1.1",
      "from": "npm:from@0.1.3",
      "map-stream": "npm:map-stream@0.1.0",
      "pause-stream": "npm:pause-stream@0.0.11",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "split": "npm:split@0.2.10",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "stream-combiner": "npm:stream-combiner@0.0.4",
      "through": "npm:through@2.3.8",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:from@0.1.3": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash._basebind@2.4.1": {
      "lodash._basecreate": "npm:lodash._basecreate@2.4.1",
      "lodash._setbinddata": "npm:lodash._setbinddata@2.4.1",
      "lodash._slice": "npm:lodash._slice@2.4.1",
      "lodash.isobject": "npm:lodash.isobject@2.4.1"
    },
    "npm:lodash._basecreate@2.4.1": {
      "lodash._isnative": "npm:lodash._isnative@2.4.1",
      "lodash.isobject": "npm:lodash.isobject@2.4.1",
      "lodash.noop": "npm:lodash.noop@2.4.1"
    },
    "npm:lodash._basecreatecallback@2.4.1": {
      "lodash._setbinddata": "npm:lodash._setbinddata@2.4.1",
      "lodash.bind": "npm:lodash.bind@2.4.1",
      "lodash.identity": "npm:lodash.identity@2.4.1",
      "lodash.support": "npm:lodash.support@2.4.1"
    },
    "npm:lodash._basecreatewrapper@2.4.1": {
      "lodash._basecreate": "npm:lodash._basecreate@2.4.1",
      "lodash._setbinddata": "npm:lodash._setbinddata@2.4.1",
      "lodash._slice": "npm:lodash._slice@2.4.1",
      "lodash.isobject": "npm:lodash.isobject@2.4.1"
    },
    "npm:lodash._createwrapper@2.4.1": {
      "lodash._basebind": "npm:lodash._basebind@2.4.1",
      "lodash._basecreatewrapper": "npm:lodash._basecreatewrapper@2.4.1",
      "lodash._slice": "npm:lodash._slice@2.4.1",
      "lodash.isfunction": "npm:lodash.isfunction@2.4.1"
    },
    "npm:lodash._setbinddata@2.4.1": {
      "lodash._isnative": "npm:lodash._isnative@2.4.1",
      "lodash.noop": "npm:lodash.noop@2.4.1"
    },
    "npm:lodash._shimkeys@2.4.1": {
      "lodash._objecttypes": "npm:lodash._objecttypes@2.4.1"
    },
    "npm:lodash.assign@2.4.1": {
      "lodash._basecreatecallback": "npm:lodash._basecreatecallback@2.4.1",
      "lodash._objecttypes": "npm:lodash._objecttypes@2.4.1",
      "lodash.keys": "npm:lodash.keys@2.4.1"
    },
    "npm:lodash.bind@2.4.1": {
      "lodash._createwrapper": "npm:lodash._createwrapper@2.4.1",
      "lodash._slice": "npm:lodash._slice@2.4.1"
    },
    "npm:lodash.isobject@2.4.1": {
      "lodash._objecttypes": "npm:lodash._objecttypes@2.4.1"
    },
    "npm:lodash.keys@2.4.1": {
      "lodash._isnative": "npm:lodash._isnative@2.4.1",
      "lodash._shimkeys": "npm:lodash._shimkeys@2.4.1",
      "lodash.isobject": "npm:lodash.isobject@2.4.1"
    },
    "npm:lodash.support@2.4.1": {
      "lodash._isnative": "npm:lodash._isnative@2.4.1"
    },
    "npm:map-stream@0.1.0": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:moment@2.10.6": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:ng-cordova@0.1.17-alpha": {
      "angular": "github:angular/bower-angular@1.4.6",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "conventional-changelog": "npm:conventional-changelog@0.0.11",
      "fs": "npm:fs@0.0.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "q": "npm:q@1.4.1",
      "sys": "github:jspm/nodelibs-util@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:pako@0.2.8": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:pause-stream@0.0.11": {
      "through": "npm:through@2.3.8"
    },
    "npm:q@1.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:qr-image@3.1.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "pako": "npm:pako@0.2.8",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:ramda@0.17.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:split@0.2.10": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "through": "npm:through@2.3.8",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:stream-combiner@0.0.4": {
      "duplexer": "npm:duplexer@0.1.1"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:through@2.3.8": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});
