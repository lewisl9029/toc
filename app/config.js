System.config({
  "baseURL": ".",
  "defaultJSExtensions": true,
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "github:*": "dependencies/github/*",
    "npm:*": "dependencies/npm/*"
  }
});

System.config({
  "depCache": {
    "npm:core-js@0.9.18/library/modules/$.enum-keys.js": [
      "npm:core-js@0.9.18/library/modules/$.js"
    ],
    "npm:angular-toastr@1.4.1/dist/angular-toastr.tpls.js": [
      "github:angular/bower-angular@1.4.3.js"
    ],
    "npm:node-forge@0.6.34/js/cipherModes.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/md5.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/sha1.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/sha256.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/sha512.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/pem.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/des.js": [
      "npm:node-forge@0.6.34/js/cipher.js",
      "npm:node-forge@0.6.34/js/cipherModes.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/pbkdf2.js": [
      "npm:node-forge@0.6.34/js/hmac.js",
      "npm:node-forge@0.6.34/js/md.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/prng.js": [
      "npm:node-forge@0.6.34/js/md.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/rc2.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/pkcs1.js": [
      "npm:node-forge@0.6.34/js/util.js",
      "npm:node-forge@0.6.34/js/random.js",
      "npm:node-forge@0.6.34/js/sha1.js"
    ],
    "npm:node-forge@0.6.34/js/prime.js": [
      "npm:node-forge@0.6.34/js/util.js",
      "npm:node-forge@0.6.34/js/jsbn.js",
      "npm:node-forge@0.6.34/js/random.js"
    ],
    "npm:node-forge@0.6.34/js/pkcs7asn1.js": [
      "npm:node-forge@0.6.34/js/asn1.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/mgf1.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/pss.js": [
      "npm:node-forge@0.6.34/js/random.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/kem.js": [
      "npm:node-forge@0.6.34/js/util.js",
      "npm:node-forge@0.6.34/js/random.js",
      "npm:node-forge@0.6.34/js/jsbn.js"
    ],
    "npm:node-forge@0.6.34/js/log.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/pkcs7.js": [
      "npm:node-forge@0.6.34/js/aes.js",
      "npm:node-forge@0.6.34/js/asn1.js",
      "npm:node-forge@0.6.34/js/des.js",
      "npm:node-forge@0.6.34/js/oids.js",
      "npm:node-forge@0.6.34/js/pem.js",
      "npm:node-forge@0.6.34/js/pkcs7asn1.js",
      "npm:node-forge@0.6.34/js/random.js",
      "npm:node-forge@0.6.34/js/util.js",
      "npm:node-forge@0.6.34/js/x509.js"
    ],
    "npm:node-forge@0.6.34/js/ssh.js": [
      "npm:node-forge@0.6.34/js/aes.js",
      "npm:node-forge@0.6.34/js/hmac.js",
      "npm:node-forge@0.6.34/js/md5.js",
      "npm:node-forge@0.6.34/js/sha1.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/task.js": [
      "npm:node-forge@0.6.34/js/debug.js",
      "npm:node-forge@0.6.34/js/log.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "github:angular/bower-angular-animate@1.4.3/angular-animate.js": [
      "github:angular/bower-angular@1.4.3.js"
    ],
    "github:angular/bower-angular-sanitize@1.4.3/angular-sanitize.js": [
      "github:angular/bower-angular@1.4.3.js"
    ],
    "github:angular-ui/ui-router@0.2.15/angular-ui-router.js": [
      "github:angular/bower-angular@1.4.3.js"
    ],
    "npm:baobab@1.1.2/src/facet.js": [
      "npm:emmett@3.1.1.js",
      "npm:baobab@1.1.2/src/cursor.js",
      "npm:baobab@1.1.2/src/helpers.js",
      "npm:baobab@1.1.2/src/type.js"
    ],
    "npm:baobab@1.1.2/src/update.js": [
      "npm:baobab@1.1.2/src/helpers.js",
      "npm:baobab@1.1.2/src/type.js"
    ],
    "npm:baobab@1.1.2/src/merge.js": [
      "npm:baobab@1.1.2/src/helpers.js",
      "npm:baobab@1.1.2/src/type.js"
    ],
    "npm:qr-encode@0.3.0/lib/polynomial.js": [
      "npm:qr-encode@0.3.0/lib/math.js"
    ],
    "npm:qr-encode@0.3.0/lib/bit-byte.js": [
      "npm:qr-encode@0.3.0/lib/constants.js",
      "npm:qr-encode@0.3.0/lib/string.js"
    ],
    "npm:qr-encode@0.3.0/lib/rsblock.js": [
      "npm:qr-encode@0.3.0/lib/constants.js"
    ],
    "npm:qr-encode@0.3.0/lib/gif.js": [
      "npm:qr-encode@0.3.0/lib/byte-array.js"
    ],
    "github:angular/bower-angular@1.4.3.js": [
      "github:angular/bower-angular@1.4.3/angular.js"
    ],
    "services/contacts/contacts.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/contacts/contacts-service.js"
    ],
    "services/channels/channels.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/channels/channels-service.js"
    ],
    "npm:remotestoragejs@0.11.2.js": [
      "npm:remotestoragejs@0.11.2/release/0.11.2/remotestorage.js"
    ],
    "npm:core-js@0.9.18/library/modules/$.js": [
      "npm:core-js@0.9.18/library/modules/$.fw.js"
    ],
    "npm:core-js@0.9.18/library/modules/$.assign.js": [
      "npm:core-js@0.9.18/library/modules/$.js",
      "npm:core-js@0.9.18/library/modules/$.enum-keys.js"
    ],
    "services/state/state.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/state/state-service.js"
    ],
    "services/devices/devices.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/devices/devices-service.js"
    ],
    "services/navigation/navigation.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/navigation/navigation-service.js"
    ],
    "libraries/telehash/telehash.js": [
      "github:angular/bower-angular@1.4.3.js",
      "libraries/telehash/telehash-library.js"
    ],
    "npm:angular-toastr@1.4.1/index.js": [
      "npm:angular-toastr@1.4.1/dist/angular-toastr.tpls.js"
    ],
    "npm:node-forge@0.6.34/js/cipher.js": [
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/asn1.js": [
      "npm:node-forge@0.6.34/js/util.js",
      "npm:node-forge@0.6.34/js/oids.js"
    ],
    "npm:node-forge@0.6.34/js/md.js": [
      "npm:node-forge@0.6.34/js/md5.js",
      "npm:node-forge@0.6.34/js/sha1.js",
      "npm:node-forge@0.6.34/js/sha256.js",
      "npm:node-forge@0.6.34/js/sha512.js"
    ],
    "npm:node-forge@0.6.34/js/random.js": [
      "npm:node-forge@0.6.34/js/aes.js",
      "npm:node-forge@0.6.34/js/md.js",
      "npm:node-forge@0.6.34/js/prng.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/rsa.js": [
      "npm:node-forge@0.6.34/js/asn1.js",
      "npm:node-forge@0.6.34/js/jsbn.js",
      "npm:node-forge@0.6.34/js/oids.js",
      "npm:node-forge@0.6.34/js/pkcs1.js",
      "npm:node-forge@0.6.34/js/prime.js",
      "npm:node-forge@0.6.34/js/random.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/mgf.js": [
      "npm:node-forge@0.6.34/js/mgf1.js"
    ],
    "services/session/session.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/session/session-service.js"
    ],
    "services/status/status.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/status/status-service.js"
    ],
    "npm:moment@2.10.6.js": [
      "npm:moment@2.10.6/moment.js"
    ],
    "github:angular/bower-angular-animate@1.4.3.js": [
      "github:angular/bower-angular-animate@1.4.3/angular-animate.js"
    ],
    "github:angular/bower-angular-sanitize@1.4.3.js": [
      "github:angular/bower-angular-sanitize@1.4.3/angular-sanitize.js"
    ],
    "github:angular-ui/ui-router@0.2.15.js": [
      "github:angular-ui/ui-router@0.2.15/angular-ui-router.js"
    ],
    "npm:emmett@3.1.1.js": [
      "npm:emmett@3.1.1/emmett.js"
    ],
    "npm:baobab@1.1.2/src/type.js": [
      "npm:baobab@1.1.2/src/cursor.js",
      "npm:baobab@1.1.2/src/facet.js"
    ],
    "npm:process@0.10.1.js": [
      "npm:process@0.10.1/browser.js"
    ],
    "npm:qr-encode@0.3.0/lib/qr.js": [
      "npm:qr-encode@0.3.0/lib/b64encode.js",
      "npm:qr-encode@0.3.0/lib/byte-array.js",
      "npm:qr-encode@0.3.0/lib/math.js",
      "npm:qr-encode@0.3.0/lib/polynomial.js",
      "npm:qr-encode@0.3.0/lib/constants.js",
      "npm:qr-encode@0.3.0/lib/bit-buffer.js",
      "npm:qr-encode@0.3.0/lib/string.js",
      "npm:qr-encode@0.3.0/lib/bit-byte.js",
      "npm:qr-encode@0.3.0/lib/rsblock.js",
      "npm:qr-encode@0.3.0/lib/gif.js"
    ],
    "npm:ng-cordova@0.1.17-alpha.js": [
      "npm:ng-cordova@0.1.17-alpha/dist/ng-cordova.js"
    ],
    "views/channel/channel-config.js": [
      "views/channel/channel.html!github:systemjs/plugin-text@0.0.2.js",
      "views/channel/channel-controller.js"
    ],
    "views/home/home-config.js": [
      "views/home/home.html!github:systemjs/plugin-text@0.0.2.js",
      "views/home/home-controller.js"
    ],
    "views/welcome/welcome-config.js": [
      "views/welcome/welcome.html!github:systemjs/plugin-text@0.0.2.js",
      "views/welcome/welcome-controller.js"
    ],
    "views/signin/signin-config.js": [
      "views/signin/signin.html!github:systemjs/plugin-text@0.0.2.js"
    ],
    "views/signup/signup-config.js": [
      "views/signup/signup.html!github:systemjs/plugin-text@0.0.2.js"
    ],
    "views/cloud/cloud-config.js": [
      "views/cloud/cloud.html!github:systemjs/plugin-text@0.0.2.js",
      "views/cloud/cloud-controller.js"
    ],
    "components/auto-focus/auto-focus.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/auto-focus/auto-focus-directive.js"
    ],
    "components/channel-list/channel-list-directive.js": [
      "components/channel-list/channel-list.html!github:systemjs/plugin-text@0.0.2.js"
    ],
    "components/message-list/message-list-directive.js": [
      "components/message-list/message-list.html!github:systemjs/plugin-text@0.0.2.js"
    ],
    "components/qr-image/qr-image.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/qr-image/qr-image-directive.js"
    ],
    "components/spinner-button/spinner-button.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/spinner-button/spinner-button-directive.js"
    ],
    "components/signup-form/signup-form-directive.js": [
      "components/signup-form/signup-form.html!github:systemjs/plugin-text@0.0.2.js"
    ],
    "components/signin-form/signin-form-directive.js": [
      "components/signin-form/signin-form.html!github:systemjs/plugin-text@0.0.2.js",
      "components/signin-form/signin-form-user-list.html!github:systemjs/plugin-text@0.0.2.js"
    ],
    "components/cloud-connect-form/cloud-connect-form-directive.js": [
      "components/cloud-connect-form/cloud-connect-form.html!github:systemjs/plugin-text@0.0.2.js"
    ],
    "components/cloud-manage-form/cloud-manage-form-directive.js": [
      "components/cloud-manage-form/cloud-manage-form.html!github:systemjs/plugin-text@0.0.2.js"
    ],
    "app-config.js": [
      "app.html!github:systemjs/plugin-text@0.0.2.js",
      "app-menu.html!github:systemjs/plugin-text@0.0.2.js"
    ],
    "libraries/remote-storage/remote-storage.js": [
      "github:angular/bower-angular@1.4.3.js",
      "npm:remotestoragejs@0.11.2.js"
    ],
    "npm:core-js@0.9.18/library/modules/$.def.js": [
      "npm:core-js@0.9.18/library/modules/$.js"
    ],
    "services/network/network.js": [
      "github:angular/bower-angular@1.4.3.js",
      "libraries/telehash/telehash.js",
      "services/state/state.js",
      "services/network/network-service.js"
    ],
    "npm:angular-toastr@1.4.1.js": [
      "npm:angular-toastr@1.4.1/index.js"
    ],
    "npm:node-forge@0.6.34/js/aes.js": [
      "npm:node-forge@0.6.34/js/cipher.js",
      "npm:node-forge@0.6.34/js/cipherModes.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/hmac.js": [
      "npm:node-forge@0.6.34/js/md.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/pbe.js": [
      "npm:node-forge@0.6.34/js/aes.js",
      "npm:node-forge@0.6.34/js/asn1.js",
      "npm:node-forge@0.6.34/js/des.js",
      "npm:node-forge@0.6.34/js/md.js",
      "npm:node-forge@0.6.34/js/oids.js",
      "npm:node-forge@0.6.34/js/pem.js",
      "npm:node-forge@0.6.34/js/pbkdf2.js",
      "npm:node-forge@0.6.34/js/random.js",
      "npm:node-forge@0.6.34/js/rc2.js",
      "npm:node-forge@0.6.34/js/rsa.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:node-forge@0.6.34/js/x509.js": [
      "npm:node-forge@0.6.34/js/aes.js",
      "npm:node-forge@0.6.34/js/asn1.js",
      "npm:node-forge@0.6.34/js/des.js",
      "npm:node-forge@0.6.34/js/md.js",
      "npm:node-forge@0.6.34/js/mgf.js",
      "npm:node-forge@0.6.34/js/oids.js",
      "npm:node-forge@0.6.34/js/pem.js",
      "npm:node-forge@0.6.34/js/pss.js",
      "npm:node-forge@0.6.34/js/rsa.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "libraries/moment/moment.js": [
      "github:angular/bower-angular@1.4.3.js",
      "npm:moment@2.10.6.js"
    ],
    "github:driftyco/ionic@1.0.1/release/js/ionic-angular.js": [
      "github:driftyco/ionic@1.0.1/release/js/ionic.js",
      "github:angular/bower-angular@1.4.3.js",
      "github:angular/bower-angular-animate@1.4.3.js",
      "github:angular/bower-angular-sanitize@1.4.3.js",
      "github:angular-ui/ui-router@0.2.15.js"
    ],
    "npm:baobab@1.1.2/src/helpers.js": [
      "npm:baobab@1.1.2/src/type.js"
    ],
    "github:jspm/nodelibs-process@0.1.1/index.js": [
      "npm:process@0.10.1.js"
    ],
    "npm:qr-encode@0.3.0/lib/qr-encode.js": [
      "npm:qr-encode@0.3.0/lib/qr.js"
    ],
    "libraries/ng-cordova/ng-cordova.js": [
      "github:angular/bower-angular@1.4.3.js",
      "npm:ng-cordova@0.1.17-alpha.js"
    ],
    "views/channel/channel.js": [
      "github:angular/bower-angular@1.4.3.js",
      "views/channel/channel-config.js",
      "views/channel/channel-controller.js"
    ],
    "views/home/home.js": [
      "github:angular/bower-angular@1.4.3.js",
      "views/home/home-config.js",
      "views/home/home-controller.js"
    ],
    "views/welcome/welcome.js": [
      "github:angular/bower-angular@1.4.3.js",
      "views/welcome/welcome-config.js",
      "views/welcome/welcome-controller.js"
    ],
    "views/signin/signin.js": [
      "github:angular/bower-angular@1.4.3.js",
      "views/signin/signin-config.js"
    ],
    "views/signup/signup.js": [
      "github:angular/bower-angular@1.4.3.js",
      "views/signup/signup-config.js"
    ],
    "views/cloud/cloud.js": [
      "github:angular/bower-angular@1.4.3.js",
      "views/cloud/cloud-config.js",
      "views/cloud/cloud-controller.js"
    ],
    "components/channel-list/channel-list.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/channel-list/channel-list-directive.js"
    ],
    "components/message-list/message-list.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/message-list/message-list-directive.js"
    ],
    "components/signup-form/signup-form.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/signup-form/signup-form-directive.js"
    ],
    "components/signin-form/signin-form.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/signin-form/signin-form-directive.js",
      "components/signin-form/signin-form-service.js"
    ],
    "components/cloud-connect-form/cloud-connect-form.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/cloud-connect-form/cloud-connect-form-directive.js"
    ],
    "components/cloud-manage-form/cloud-manage-form.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/cloud-manage-form/cloud-manage-form-directive.js"
    ],
    "npm:core-js@0.9.18/library/modules/es6.object.assign.js": [
      "npm:core-js@0.9.18/library/modules/$.def.js",
      "npm:core-js@0.9.18/library/modules/$.assign.js"
    ],
    "libraries/angular-toastr/angular-toastr.js": [
      "github:angular/bower-angular@1.4.3.js",
      "npm:angular-toastr@1.4.1.js"
    ],
    "npm:node-forge@0.6.34/js/pkcs12.js": [
      "npm:node-forge@0.6.34/js/asn1.js",
      "npm:node-forge@0.6.34/js/hmac.js",
      "npm:node-forge@0.6.34/js/oids.js",
      "npm:node-forge@0.6.34/js/pkcs7asn1.js",
      "npm:node-forge@0.6.34/js/pbe.js",
      "npm:node-forge@0.6.34/js/random.js",
      "npm:node-forge@0.6.34/js/rsa.js",
      "npm:node-forge@0.6.34/js/sha1.js",
      "npm:node-forge@0.6.34/js/util.js",
      "npm:node-forge@0.6.34/js/x509.js"
    ],
    "services/time/time.js": [
      "github:angular/bower-angular@1.4.3.js",
      "libraries/moment/moment.js",
      "services/time/time-service.js"
    ],
    "github:driftyco/ionic@1.0.1.js": [
      "github:driftyco/ionic@1.0.1/release/js/ionic-angular.js"
    ],
    "npm:baobab@1.1.2/src/cursor.js": [
      "npm:emmett@3.1.1.js",
      "npm:baobab@1.1.2/src/helpers.js",
      "npm:baobab@1.1.2/defaults.js",
      "npm:baobab@1.1.2/src/type.js"
    ],
    "github:jspm/nodelibs-process@0.1.1.js": [
      "github:jspm/nodelibs-process@0.1.1/index.js"
    ],
    "npm:qr-encode@0.3.0.js": [
      "npm:qr-encode@0.3.0/lib/qr-encode.js"
    ],
    "views/views.js": [
      "github:angular/bower-angular@1.4.3.js",
      "views/channel/channel.js",
      "views/home/home.js",
      "views/welcome/welcome.js",
      "views/signin/signin.js",
      "views/signup/signup.js",
      "views/cloud/cloud.js"
    ],
    "components/components.js": [
      "github:angular/bower-angular@1.4.3.js",
      "components/auto-focus/auto-focus.js",
      "components/channel-list/channel-list.js",
      "components/message-list/message-list.js",
      "components/qr-image/qr-image.js",
      "components/spinner-button/spinner-button.js",
      "components/signup-form/signup-form.js",
      "components/signin-form/signin-form.js",
      "components/cloud-connect-form/cloud-connect-form.js",
      "components/cloud-manage-form/cloud-manage-form.js"
    ],
    "npm:core-js@0.9.18/library/fn/object/assign.js": [
      "npm:core-js@0.9.18/library/modules/es6.object.assign.js",
      "npm:core-js@0.9.18/library/modules/$.js"
    ],
    "services/notification/notification.js": [
      "github:angular/bower-angular@1.4.3.js",
      "libraries/angular-toastr/angular-toastr.js",
      "services/state/state.js",
      "services/notification/notification-service.js"
    ],
    "npm:node-forge@0.6.34/js/pki.js": [
      "npm:node-forge@0.6.34/js/asn1.js",
      "npm:node-forge@0.6.34/js/oids.js",
      "npm:node-forge@0.6.34/js/pbe.js",
      "npm:node-forge@0.6.34/js/pem.js",
      "npm:node-forge@0.6.34/js/pbkdf2.js",
      "npm:node-forge@0.6.34/js/pkcs12.js",
      "npm:node-forge@0.6.34/js/pss.js",
      "npm:node-forge@0.6.34/js/rsa.js",
      "npm:node-forge@0.6.34/js/util.js",
      "npm:node-forge@0.6.34/js/x509.js"
    ],
    "libraries/ionic/ionic.js": [
      "github:driftyco/ionic@1.0.1.js"
    ],
    "npm:baobab@1.1.2/src/baobab.js": [
      "npm:baobab@1.1.2/src/cursor.js",
      "npm:emmett@3.1.1.js",
      "npm:baobab@1.1.2/src/facet.js",
      "npm:baobab@1.1.2/src/helpers.js",
      "npm:baobab@1.1.2/src/update.js",
      "npm:baobab@1.1.2/src/merge.js",
      "npm:baobab@1.1.2/defaults.js",
      "npm:baobab@1.1.2/src/type.js"
    ],
    "npm:ramda@0.17.1/dist/ramda.js": [
      "github:jspm/nodelibs-process@0.1.1.js"
    ],
    "libraries/qr-encode/qr-encode.js": [
      "github:angular/bower-angular@1.4.3.js",
      "npm:qr-encode@0.3.0.js"
    ],
    "npm:babel-runtime@5.8.20/core-js/object/assign.js": [
      "npm:core-js@0.9.18/library/fn/object/assign.js"
    ],
    "npm:node-forge@0.6.34/js/tls.js": [
      "npm:node-forge@0.6.34/js/asn1.js",
      "npm:node-forge@0.6.34/js/hmac.js",
      "npm:node-forge@0.6.34/js/md.js",
      "npm:node-forge@0.6.34/js/pem.js",
      "npm:node-forge@0.6.34/js/pki.js",
      "npm:node-forge@0.6.34/js/random.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "npm:baobab@1.1.2/index.js": [
      "npm:baobab@1.1.2/src/baobab.js",
      "npm:baobab@1.1.2/src/cursor.js",
      "npm:baobab@1.1.2/src/facet.js",
      "npm:baobab@1.1.2/src/helpers.js"
    ],
    "npm:ramda@0.17.1.js": [
      "npm:ramda@0.17.1/dist/ramda.js"
    ],
    "services/storage/storage-service.js": [
      "npm:babel-runtime@5.8.20/core-js/object/assign.js"
    ],
    "npm:node-forge@0.6.34/js/aesCipherSuites.js": [
      "npm:node-forge@0.6.34/js/aes.js",
      "npm:node-forge@0.6.34/js/tls.js"
    ],
    "npm:baobab@1.1.2.js": [
      "npm:baobab@1.1.2/index.js"
    ],
    "libraries/ramda/ramda.js": [
      "github:angular/bower-angular@1.4.3.js",
      "npm:ramda@0.17.1.js"
    ],
    "services/storage/storage.js": [
      "github:angular/bower-angular@1.4.3.js",
      "libraries/remote-storage/remote-storage.js",
      "services/storage/storage-service.js"
    ],
    "npm:node-forge@0.6.34/js/forge.js": [
      "npm:node-forge@0.6.34/js/aes.js",
      "npm:node-forge@0.6.34/js/aesCipherSuites.js",
      "npm:node-forge@0.6.34/js/asn1.js",
      "npm:node-forge@0.6.34/js/cipher.js",
      "npm:node-forge@0.6.34/js/cipherModes.js",
      "npm:node-forge@0.6.34/js/debug.js",
      "npm:node-forge@0.6.34/js/des.js",
      "npm:node-forge@0.6.34/js/hmac.js",
      "npm:node-forge@0.6.34/js/kem.js",
      "npm:node-forge@0.6.34/js/log.js",
      "npm:node-forge@0.6.34/js/md.js",
      "npm:node-forge@0.6.34/js/mgf1.js",
      "npm:node-forge@0.6.34/js/pbkdf2.js",
      "npm:node-forge@0.6.34/js/pem.js",
      "npm:node-forge@0.6.34/js/pkcs7.js",
      "npm:node-forge@0.6.34/js/pkcs1.js",
      "npm:node-forge@0.6.34/js/pkcs12.js",
      "npm:node-forge@0.6.34/js/pki.js",
      "npm:node-forge@0.6.34/js/prime.js",
      "npm:node-forge@0.6.34/js/prng.js",
      "npm:node-forge@0.6.34/js/pss.js",
      "npm:node-forge@0.6.34/js/random.js",
      "npm:node-forge@0.6.34/js/rc2.js",
      "npm:node-forge@0.6.34/js/ssh.js",
      "npm:node-forge@0.6.34/js/task.js",
      "npm:node-forge@0.6.34/js/tls.js",
      "npm:node-forge@0.6.34/js/util.js"
    ],
    "libraries/baobab/baobab.js": [
      "github:angular/bower-angular@1.4.3.js",
      "npm:baobab@1.1.2.js"
    ],
    "services/identity/identity.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/storage/storage.js",
      "services/state/state.js",
      "services/identity/identity-service.js"
    ],
    "npm:node-forge@0.6.34.js": [
      "npm:node-forge@0.6.34/js/forge.js"
    ],
    "libraries/libraries.js": [
      "github:angular/bower-angular@1.4.3.js",
      "libraries/ionic/ionic.js",
      "libraries/baobab/baobab.js",
      "libraries/angular-toastr/angular-toastr.js",
      "libraries/moment/moment.js",
      "libraries/ramda/ramda.js",
      "libraries/remote-storage/remote-storage.js",
      "libraries/qr-encode/qr-encode.js",
      "libraries/forge/forge.js",
      "libraries/telehash/telehash.js",
      "libraries/ng-cordova/ng-cordova.js"
    ],
    "libraries/forge/forge.js": [
      "github:angular/bower-angular@1.4.3.js",
      "npm:node-forge@0.6.34.js"
    ],
    "services/cryptography/cryptography.js": [
      "github:angular/bower-angular@1.4.3.js",
      "libraries/forge/forge.js",
      "services/cryptography/cryptography-service.js"
    ],
    "services/services.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/contacts/contacts.js",
      "services/channels/channels.js",
      "services/identity/identity.js",
      "services/devices/devices.js",
      "services/navigation/navigation.js",
      "services/network/network.js",
      "services/notification/notification.js",
      "services/storage/storage.js",
      "services/cryptography/cryptography.js",
      "services/session/session.js",
      "services/status/status.js",
      "services/state/state.js",
      "services/time/time.js"
    ],
    "app.js": [
      "github:angular/bower-angular@1.4.3.js",
      "services/services.js",
      "libraries/libraries.js",
      "views/views.js",
      "components/components.js",
      "app-run.js",
      "app-config.js"
    ],
    "npm:ng-cordova@0.1.17-alpha/dist/ng-cordova.js": [
      "github:angular/bower-angular@1.4.3.js"
    ]
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.4.3",
    "angular-toastr": "npm:angular-toastr@1.4.1",
    "babel": "npm:babel-core@5.8.20",
    "babel-runtime": "npm:babel-runtime@5.8.20",
    "baobab": "npm:baobab@1.1.2",
    "core-js": "npm:core-js@0.9.18",
    "driftyco/ionic": "github:driftyco/ionic@1.0.1",
    "moment": "npm:moment@2.10.6",
    "ng-cordova": "npm:ng-cordova@0.1.17-alpha",
    "node-forge": "npm:node-forge@0.6.34",
    "plugin-text": "github:systemjs/plugin-text@0.0.2",
    "qr-encode": "npm:qr-encode@0.3.0",
    "ramda": "npm:ramda@0.17.1",
    "remotestoragejs": "npm:remotestoragejs@0.11.2",
    "sinon": "npm:sinon@1.15.4",
    "text": "github:systemjs/plugin-text@0.0.2",
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:angular/bower-angular-animate@1.4.3": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:angular/bower-angular-sanitize@1.4.3": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:driftyco/ionic@1.0.1": {
      "angular": "github:angular/bower-angular@1.4.3",
      "angular-animate": "github:angular/bower-angular-animate@1.4.3",
      "angular-sanitize": "github:angular/bower-angular-sanitize@1.4.3",
      "angular-ui-router": "github:angular-ui/ui-router@0.2.15"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.3.1"
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
    "npm:angular-toastr@1.4.1": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "npm:babel-runtime@5.8.20": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:baobab@1.1.2": {
      "emmett": "npm:emmett@3.1.1"
    },
    "npm:buffer@3.3.1": {
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
    "npm:core-js@0.9.18": {
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
    "npm:formatio@1.1.1": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "samsam": "npm:samsam@1.1.2"
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
      "angular": "github:angular/bower-angular@1.4.3",
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
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:pause-stream@0.0.11": {
      "through": "npm:through@2.3.8"
    },
    "npm:q@1.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
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
    "npm:sinon@1.15.4": {
      "formatio": "npm:formatio@1.1.1",
      "lolex": "npm:lolex@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "samsam": "npm:samsam@1.1.2",
      "util": "npm:util@0.10.3"
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

