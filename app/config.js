System.config({
  "baseURL": ".",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "dependencies/github/*.js",
    "npm:*": "dependencies/npm/*.js"
  },
  "bundles": {
    "libraries": [
      "github:angular/bower-angular@1.3.15/angular",
      "github:driftyco/ionic@1.0.0/release/js/ionic",
      "github:angular/bower-angular-animate@1.3.15/angular-animate",
      "github:angular/bower-angular-sanitize@1.3.15/angular-sanitize",
      "github:angular-ui/ui-router@0.2.15/angular-ui-router",
      "npm:emmett@3.0.0/emmett",
      "npm:baobab@1.0.2/src/facet",
      "npm:baobab@1.0.2/defaults",
      "npm:baobab@1.0.2/src/update",
      "npm:baobab@1.0.2/src/merge",
      "npm:angular-toastr@1.3.1/dist/angular-toastr.tpls",
      "npm:moment@2.10.2/moment",
      "npm:process@0.10.1/browser",
      "npm:remotestoragejs@0.11.2/release/0.11.2/remotestorage",
      "npm:qr-encode@0.3.0/lib/b64encode",
      "npm:qr-encode@0.3.0/lib/byte-array",
      "npm:qr-encode@0.3.0/lib/math",
      "npm:qr-encode@0.3.0/lib/polynomial",
      "npm:qr-encode@0.3.0/lib/constants",
      "npm:qr-encode@0.3.0/lib/bit-buffer",
      "npm:qr-encode@0.3.0/lib/string",
      "npm:qr-encode@0.3.0/lib/bit-byte",
      "npm:qr-encode@0.3.0/lib/rsblock",
      "npm:qr-encode@0.3.0/lib/gif",
      "libraries/telehash/telehash-library",
      "github:angular/bower-angular@1.3.15",
      "github:angular/bower-angular-animate@1.3.15",
      "github:angular/bower-angular-sanitize@1.3.15",
      "github:angular-ui/ui-router@0.2.15",
      "npm:emmett@3.0.0",
      "npm:baobab@1.0.2/src/type",
      "npm:angular-toastr@1.3.1",
      "npm:moment@2.10.2",
      "npm:process@0.10.1",
      "npm:remotestoragejs@0.11.2",
      "npm:qr-encode@0.3.0/lib/qr",
      "libraries/telehash/telehash",
      "github:driftyco/ionic@1.0.0/release/js/ionic-angular",
      "npm:baobab@1.0.2/src/helpers",
      "libraries/angular-toastr/angular-toastr",
      "libraries/moment/moment",
      "github:jspm/nodelibs-process@0.1.1/index",
      "libraries/remote-storage/remote-storage",
      "npm:qr-encode@0.3.0/lib/qr-encode",
      "github:driftyco/ionic@1.0.0",
      "npm:baobab@1.0.2/src/cursor",
      "github:jspm/nodelibs-process@0.1.1",
      "npm:qr-encode@0.3.0",
      "libraries/ionic/ionic",
      "npm:baobab@1.0.2/src/baobab",
      "npm:ramda@0.11.0/dist/ramda",
      "libraries/qr-encode/qr-encode",
      "npm:baobab@1.0.2/index",
      "npm:ramda@0.11.0",
      "npm:baobab@1.0.2",
      "libraries/ramda/ramda",
      "libraries/baobab/baobab",
      "libraries/forge/forge",
      "libraries/libraries"
    ]
  }
});

System.config({
  "depCache": {
    "npm:core-js@0.9.6/library/modules/$.enum-keys": [
      "npm:core-js@0.9.6/library/modules/$"
    ],
    "npm:core-js@0.9.6/library/modules/$.uid": [
      "npm:core-js@0.9.6/library/modules/$"
    ],
    "npm:core-js@0.9.6/library/modules/$.string-at": [
      "npm:core-js@0.9.6/library/modules/$"
    ],
    "npm:core-js@0.9.6/library/modules/$.assert": [
      "npm:core-js@0.9.6/library/modules/$"
    ],
    "npm:core-js@0.9.6/library/modules/$.iter-define": [
      "npm:core-js@0.9.6/library/modules/$.def",
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.cof",
      "npm:core-js@0.9.6/library/modules/$.iter",
      "npm:core-js@0.9.6/library/modules/$.wks"
    ],
    "npm:core-js@0.9.6/library/modules/$.unscope": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.wks"
    ],
    "npm:core-js@0.9.6/library/modules/$.ctx": [
      "npm:core-js@0.9.6/library/modules/$.assert"
    ],
    "npm:core-js@0.9.6/library/modules/$.iter-call": [
      "npm:core-js@0.9.6/library/modules/$.assert"
    ],
    "npm:core-js@0.9.6/library/modules/$.species": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.wks"
    ],
    "npm:core-js@0.9.6/library/modules/$.iter-detect": [
      "npm:core-js@0.9.6/library/modules/$.wks"
    ],
    "npm:core-js@0.9.6/library/modules/$.collection-to-json": [
      "npm:core-js@0.9.6/library/modules/$.def",
      "npm:core-js@0.9.6/library/modules/$.for-of"
    ],
    "npm:angular-toastr@1.3.1/dist/angular-toastr.tpls": [
      "github:angular/bower-angular@1.3.15"
    ],
    "npm:node-forge@0.6.26/js/cipherModes": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/md5": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/sha1": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/sha256": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/sha512": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/pem": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/des": [
      "npm:node-forge@0.6.26/js/cipher",
      "npm:node-forge@0.6.26/js/cipherModes",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/pbkdf2": [
      "npm:node-forge@0.6.26/js/hmac",
      "npm:node-forge@0.6.26/js/md",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/prng": [
      "npm:node-forge@0.6.26/js/md",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/rc2": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/pkcs1": [
      "npm:node-forge@0.6.26/js/util",
      "npm:node-forge@0.6.26/js/random",
      "npm:node-forge@0.6.26/js/sha1"
    ],
    "npm:node-forge@0.6.26/js/prime": [
      "npm:node-forge@0.6.26/js/util",
      "npm:node-forge@0.6.26/js/jsbn",
      "npm:node-forge@0.6.26/js/random"
    ],
    "npm:node-forge@0.6.26/js/pkcs7asn1": [
      "npm:node-forge@0.6.26/js/asn1",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/mgf1": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/pss": [
      "npm:node-forge@0.6.26/js/random",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/kem": [
      "npm:node-forge@0.6.26/js/util",
      "npm:node-forge@0.6.26/js/random",
      "npm:node-forge@0.6.26/js/jsbn"
    ],
    "npm:node-forge@0.6.26/js/log": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/pkcs7": [
      "npm:node-forge@0.6.26/js/aes",
      "npm:node-forge@0.6.26/js/asn1",
      "npm:node-forge@0.6.26/js/des",
      "npm:node-forge@0.6.26/js/oids",
      "npm:node-forge@0.6.26/js/pem",
      "npm:node-forge@0.6.26/js/pkcs7asn1",
      "npm:node-forge@0.6.26/js/random",
      "npm:node-forge@0.6.26/js/util",
      "npm:node-forge@0.6.26/js/x509"
    ],
    "npm:node-forge@0.6.26/js/ssh": [
      "npm:node-forge@0.6.26/js/aes",
      "npm:node-forge@0.6.26/js/hmac",
      "npm:node-forge@0.6.26/js/md5",
      "npm:node-forge@0.6.26/js/sha1",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/task": [
      "npm:node-forge@0.6.26/js/debug",
      "npm:node-forge@0.6.26/js/log",
      "npm:node-forge@0.6.26/js/util"
    ],
    "github:angular/bower-angular-animate@1.3.15/angular-animate": [
      "github:angular/bower-angular@1.3.15"
    ],
    "github:angular/bower-angular-sanitize@1.3.15/angular-sanitize": [
      "github:angular/bower-angular@1.3.15"
    ],
    "github:angular-ui/ui-router@0.2.15/angular-ui-router": [
      "github:angular/bower-angular@1.3.15"
    ],
    "npm:baobab@1.0.2/src/facet": [
      "npm:emmett@3.0.0",
      "npm:baobab@1.0.2/src/cursor",
      "npm:baobab@1.0.2/src/helpers",
      "npm:baobab@1.0.2/src/type"
    ],
    "npm:baobab@1.0.2/src/update": [
      "npm:baobab@1.0.2/src/helpers",
      "npm:baobab@1.0.2/src/type"
    ],
    "npm:baobab@1.0.2/src/merge": [
      "npm:baobab@1.0.2/src/helpers",
      "npm:baobab@1.0.2/src/type"
    ],
    "npm:qr-encode@0.3.0/lib/polynomial": [
      "npm:qr-encode@0.3.0/lib/math"
    ],
    "npm:qr-encode@0.3.0/lib/bit-byte": [
      "npm:qr-encode@0.3.0/lib/constants",
      "npm:qr-encode@0.3.0/lib/string"
    ],
    "npm:qr-encode@0.3.0/lib/rsblock": [
      "npm:qr-encode@0.3.0/lib/constants"
    ],
    "npm:qr-encode@0.3.0/lib/gif": [
      "npm:qr-encode@0.3.0/lib/byte-array"
    ],
    "github:angular/bower-angular@1.3.15": [
      "github:angular/bower-angular@1.3.15/angular"
    ],
    "npm:process@0.10.1": [
      "npm:process@0.10.1/browser"
    ],
    "npm:remotestoragejs@0.11.2": [
      "npm:remotestoragejs@0.11.2/release/0.11.2/remotestorage"
    ],
    "npm:core-js@0.9.6/library/modules/$": [
      "npm:core-js@0.9.6/library/modules/$.fw"
    ],
    "npm:core-js@0.9.6/library/modules/$.assign": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.enum-keys"
    ],
    "npm:core-js@0.9.6/library/modules/$.wks": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.uid"
    ],
    "npm:core-js@0.9.6/library/modules/$.iter": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.cof",
      "npm:core-js@0.9.6/library/modules/$.assert",
      "npm:core-js@0.9.6/library/modules/$.wks"
    ],
    "npm:core-js@0.9.6/library/modules/es6.array.iterator": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.unscope",
      "npm:core-js@0.9.6/library/modules/$.uid",
      "npm:core-js@0.9.6/library/modules/$.iter",
      "npm:core-js@0.9.6/library/modules/$.iter-define"
    ],
    "npm:core-js@0.9.6/library/modules/$.for-of": [
      "npm:core-js@0.9.6/library/modules/$.ctx",
      "npm:core-js@0.9.6/library/modules/$.iter",
      "npm:core-js@0.9.6/library/modules/$.iter-call"
    ],
    "npm:core-js@0.9.6/library/modules/$.collection": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.def",
      "npm:core-js@0.9.6/library/modules/$.iter",
      "npm:core-js@0.9.6/library/modules/$.for-of",
      "npm:core-js@0.9.6/library/modules/$.species",
      "npm:core-js@0.9.6/library/modules/$.assert",
      "npm:core-js@0.9.6/library/modules/$.iter-detect",
      "npm:core-js@0.9.6/library/modules/$.cof"
    ],
    "npm:core-js@0.9.6/library/modules/es7.map.to-json": [
      "npm:core-js@0.9.6/library/modules/$.collection-to-json"
    ],
    "services/navigation/navigation": [
      "github:angular/bower-angular@1.3.15",
      "services/navigation/navigation-service"
    ],
    "libraries/telehash/telehash": [
      "github:angular/bower-angular@1.3.15",
      "libraries/telehash/telehash-library"
    ],
    "npm:angular-toastr@1.3.1": [
      "npm:angular-toastr@1.3.1/dist/angular-toastr.tpls"
    ],
    "npm:node-forge@0.6.26/js/cipher": [
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/asn1": [
      "npm:node-forge@0.6.26/js/util",
      "npm:node-forge@0.6.26/js/oids"
    ],
    "npm:node-forge@0.6.26/js/md": [
      "npm:node-forge@0.6.26/js/md5",
      "npm:node-forge@0.6.26/js/sha1",
      "npm:node-forge@0.6.26/js/sha256",
      "npm:node-forge@0.6.26/js/sha512"
    ],
    "npm:node-forge@0.6.26/js/random": [
      "npm:node-forge@0.6.26/js/aes",
      "npm:node-forge@0.6.26/js/md",
      "npm:node-forge@0.6.26/js/prng",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/rsa": [
      "npm:node-forge@0.6.26/js/asn1",
      "npm:node-forge@0.6.26/js/jsbn",
      "npm:node-forge@0.6.26/js/oids",
      "npm:node-forge@0.6.26/js/pkcs1",
      "npm:node-forge@0.6.26/js/prime",
      "npm:node-forge@0.6.26/js/random",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/mgf": [
      "npm:node-forge@0.6.26/js/mgf1"
    ],
    "npm:moment@2.10.2": [
      "npm:moment@2.10.2/moment"
    ],
    "github:angular/bower-angular-animate@1.3.15": [
      "github:angular/bower-angular-animate@1.3.15/angular-animate"
    ],
    "github:angular/bower-angular-sanitize@1.3.15": [
      "github:angular/bower-angular-sanitize@1.3.15/angular-sanitize"
    ],
    "github:angular-ui/ui-router@0.2.15": [
      "github:angular-ui/ui-router@0.2.15/angular-ui-router"
    ],
    "npm:emmett@3.0.0": [
      "npm:emmett@3.0.0/emmett"
    ],
    "npm:baobab@1.0.2/src/type": [
      "npm:baobab@1.0.2/src/cursor",
      "npm:baobab@1.0.2/src/facet"
    ],
    "npm:qr-encode@0.3.0/lib/qr": [
      "npm:qr-encode@0.3.0/lib/b64encode",
      "npm:qr-encode@0.3.0/lib/byte-array",
      "npm:qr-encode@0.3.0/lib/math",
      "npm:qr-encode@0.3.0/lib/polynomial",
      "npm:qr-encode@0.3.0/lib/constants",
      "npm:qr-encode@0.3.0/lib/bit-buffer",
      "npm:qr-encode@0.3.0/lib/string",
      "npm:qr-encode@0.3.0/lib/bit-byte",
      "npm:qr-encode@0.3.0/lib/rsblock",
      "npm:qr-encode@0.3.0/lib/gif"
    ],
    "views/channel/channel-config": [
      "views/channel/channel.html!github:systemjs/plugin-text@0.0.2",
      "views/channel/channel-controller"
    ],
    "views/home/home-config": [
      "views/home/home.html!github:systemjs/plugin-text@0.0.2",
      "views/home/home-controller"
    ],
    "views/welcome/welcome-config": [
      "views/welcome/welcome.html!github:systemjs/plugin-text@0.0.2",
      "views/welcome/welcome-controller"
    ],
    "views/signin/signin-config": [
      "views/signin/signin.html!github:systemjs/plugin-text@0.0.2"
    ],
    "views/signup/signup-config": [
      "views/signup/signup.html!github:systemjs/plugin-text@0.0.2"
    ],
    "views/cloud/cloud-config": [
      "views/cloud/cloud.html!github:systemjs/plugin-text@0.0.2",
      "views/cloud/cloud-controller"
    ],
    "components/header/header-directive": [
      "components/header/header.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/auto-focus/auto-focus": [
      "github:angular/bower-angular@1.3.15",
      "components/auto-focus/auto-focus-directive"
    ],
    "components/channel-list/channel-list-directive": [
      "components/channel-list/channel-list.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/message-list/message-list-directive": [
      "components/message-list/message-list.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/qr-image/qr-image": [
      "github:angular/bower-angular@1.3.15",
      "components/qr-image/qr-image-directive"
    ],
    "components/spinner-button/spinner-button": [
      "github:angular/bower-angular@1.3.15",
      "components/spinner-button/spinner-button-directive"
    ],
    "components/signup-form/signup-form-directive": [
      "components/signup-form/signup-form.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/signin-form/signin-form-directive": [
      "components/signin-form/signin-form.html!github:systemjs/plugin-text@0.0.2",
      "components/signin-form/signin-form-user-list.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/cloud-connect-form/cloud-connect-form-directive": [
      "components/cloud-connect-form/cloud-connect-form.html!github:systemjs/plugin-text@0.0.2"
    ],
    "components/cloud-manage-form/cloud-manage-form-directive": [
      "components/cloud-manage-form/cloud-manage-form.html!github:systemjs/plugin-text@0.0.2"
    ],
    "app-config": [
      "app.html!github:systemjs/plugin-text@0.0.2"
    ],
    "github:jspm/nodelibs-process@0.1.1/index": [
      "npm:process@0.10.1"
    ],
    "libraries/remote-storage/remote-storage": [
      "github:angular/bower-angular@1.3.15",
      "npm:remotestoragejs@0.11.2"
    ],
    "npm:core-js@0.9.6/library/modules/$.def": [
      "npm:core-js@0.9.6/library/modules/$"
    ],
    "npm:core-js@0.9.6/library/modules/$.cof": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.wks"
    ],
    "npm:core-js@0.9.6/library/modules/es6.string.iterator": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.string-at",
      "npm:core-js@0.9.6/library/modules/$.uid",
      "npm:core-js@0.9.6/library/modules/$.iter",
      "npm:core-js@0.9.6/library/modules/$.iter-define"
    ],
    "npm:core-js@0.9.6/library/modules/web.dom.iterable": [
      "npm:core-js@0.9.6/library/modules/es6.array.iterator",
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.iter",
      "npm:core-js@0.9.6/library/modules/$.wks"
    ],
    "npm:core-js@0.9.6/library/modules/$.collection-strong": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.ctx",
      "npm:core-js@0.9.6/library/modules/$.uid",
      "npm:core-js@0.9.6/library/modules/$.assert",
      "npm:core-js@0.9.6/library/modules/$.for-of",
      "npm:core-js@0.9.6/library/modules/$.iter",
      "npm:core-js@0.9.6/library/modules/$.iter-define"
    ],
    "services/network/network": [
      "github:angular/bower-angular@1.3.15",
      "libraries/telehash/telehash",
      "services/state/state",
      "services/network/network-service"
    ],
    "libraries/angular-toastr/angular-toastr": [
      "github:angular/bower-angular@1.3.15",
      "npm:angular-toastr@1.3.1"
    ],
    "npm:node-forge@0.6.26/js/aes": [
      "npm:node-forge@0.6.26/js/cipher",
      "npm:node-forge@0.6.26/js/cipherModes",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/hmac": [
      "npm:node-forge@0.6.26/js/md",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/pbe": [
      "npm:node-forge@0.6.26/js/aes",
      "npm:node-forge@0.6.26/js/asn1",
      "npm:node-forge@0.6.26/js/des",
      "npm:node-forge@0.6.26/js/md",
      "npm:node-forge@0.6.26/js/oids",
      "npm:node-forge@0.6.26/js/pem",
      "npm:node-forge@0.6.26/js/pbkdf2",
      "npm:node-forge@0.6.26/js/random",
      "npm:node-forge@0.6.26/js/rc2",
      "npm:node-forge@0.6.26/js/rsa",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:node-forge@0.6.26/js/x509": [
      "npm:node-forge@0.6.26/js/aes",
      "npm:node-forge@0.6.26/js/asn1",
      "npm:node-forge@0.6.26/js/des",
      "npm:node-forge@0.6.26/js/md",
      "npm:node-forge@0.6.26/js/mgf",
      "npm:node-forge@0.6.26/js/oids",
      "npm:node-forge@0.6.26/js/pem",
      "npm:node-forge@0.6.26/js/pss",
      "npm:node-forge@0.6.26/js/rsa",
      "npm:node-forge@0.6.26/js/util"
    ],
    "libraries/moment/moment": [
      "github:angular/bower-angular@1.3.15",
      "npm:moment@2.10.2"
    ],
    "github:driftyco/ionic@1.0.0/release/js/ionic-angular": [
      "github:driftyco/ionic@1.0.0/release/js/ionic",
      "github:angular/bower-angular@1.3.15",
      "github:angular/bower-angular-animate@1.3.15",
      "github:angular/bower-angular-sanitize@1.3.15",
      "github:angular-ui/ui-router@0.2.15"
    ],
    "npm:baobab@1.0.2/src/helpers": [
      "npm:baobab@1.0.2/src/type"
    ],
    "npm:qr-encode@0.3.0/lib/qr-encode": [
      "npm:qr-encode@0.3.0/lib/qr"
    ],
    "views/channel/channel": [
      "github:angular/bower-angular@1.3.15",
      "views/channel/channel-config",
      "views/channel/channel-controller"
    ],
    "views/home/home": [
      "github:angular/bower-angular@1.3.15",
      "views/home/home-config",
      "views/home/home-controller"
    ],
    "views/welcome/welcome": [
      "github:angular/bower-angular@1.3.15",
      "views/welcome/welcome-config",
      "views/welcome/welcome-controller"
    ],
    "views/signin/signin": [
      "github:angular/bower-angular@1.3.15",
      "views/signin/signin-config"
    ],
    "views/signup/signup": [
      "github:angular/bower-angular@1.3.15",
      "views/signup/signup-config"
    ],
    "views/cloud/cloud": [
      "github:angular/bower-angular@1.3.15",
      "views/cloud/cloud-config",
      "views/cloud/cloud-controller"
    ],
    "components/header/header": [
      "github:angular/bower-angular@1.3.15",
      "components/header/header-directive"
    ],
    "components/channel-list/channel-list": [
      "github:angular/bower-angular@1.3.15",
      "components/channel-list/channel-list-directive"
    ],
    "components/message-list/message-list": [
      "github:angular/bower-angular@1.3.15",
      "components/message-list/message-list-directive"
    ],
    "components/signup-form/signup-form": [
      "github:angular/bower-angular@1.3.15",
      "components/signup-form/signup-form-directive"
    ],
    "components/signin-form/signin-form": [
      "github:angular/bower-angular@1.3.15",
      "components/signin-form/signin-form-directive",
      "components/signin-form/signin-form-service"
    ],
    "components/cloud-connect-form/cloud-connect-form": [
      "github:angular/bower-angular@1.3.15",
      "components/cloud-connect-form/cloud-connect-form-directive"
    ],
    "components/cloud-manage-form/cloud-manage-form": [
      "github:angular/bower-angular@1.3.15",
      "components/cloud-manage-form/cloud-manage-form-directive"
    ],
    "github:jspm/nodelibs-process@0.1.1": [
      "github:jspm/nodelibs-process@0.1.1/index"
    ],
    "npm:core-js@0.9.6/library/modules/es6.object.assign": [
      "npm:core-js@0.9.6/library/modules/$.def",
      "npm:core-js@0.9.6/library/modules/$.assign"
    ],
    "npm:core-js@0.9.6/library/modules/es6.object.to-string": [
      "npm:core-js@0.9.6/library/modules/$",
      "npm:core-js@0.9.6/library/modules/$.cof",
      "npm:core-js@0.9.6/library/modules/$.wks"
    ],
    "npm:core-js@0.9.6/library/modules/es6.map": [
      "npm:core-js@0.9.6/library/modules/$.collection-strong",
      "npm:core-js@0.9.6/library/modules/$.collection"
    ],
    "services/notification/notification": [
      "github:angular/bower-angular@1.3.15",
      "libraries/angular-toastr/angular-toastr",
      "services/state/state",
      "services/notification/notification-service"
    ],
    "npm:node-forge@0.6.26/js/pkcs12": [
      "npm:node-forge@0.6.26/js/asn1",
      "npm:node-forge@0.6.26/js/hmac",
      "npm:node-forge@0.6.26/js/oids",
      "npm:node-forge@0.6.26/js/pkcs7asn1",
      "npm:node-forge@0.6.26/js/pbe",
      "npm:node-forge@0.6.26/js/random",
      "npm:node-forge@0.6.26/js/rsa",
      "npm:node-forge@0.6.26/js/sha1",
      "npm:node-forge@0.6.26/js/util",
      "npm:node-forge@0.6.26/js/x509"
    ],
    "services/time/time": [
      "github:angular/bower-angular@1.3.15",
      "libraries/moment/moment",
      "services/time/time-service"
    ],
    "github:driftyco/ionic@1.0.0": [
      "github:driftyco/ionic@1.0.0/release/js/ionic-angular"
    ],
    "npm:baobab@1.0.2/src/cursor": [
      "npm:emmett@3.0.0",
      "npm:baobab@1.0.2/src/helpers",
      "npm:baobab@1.0.2/defaults",
      "npm:baobab@1.0.2/src/type"
    ],
    "npm:qr-encode@0.3.0": [
      "npm:qr-encode@0.3.0/lib/qr-encode"
    ],
    "views/views": [
      "github:angular/bower-angular@1.3.15",
      "views/channel/channel",
      "views/home/home",
      "views/welcome/welcome",
      "views/signin/signin",
      "views/signup/signup",
      "views/cloud/cloud"
    ],
    "components/components": [
      "github:angular/bower-angular@1.3.15",
      "components/header/header",
      "components/auto-focus/auto-focus",
      "components/channel-list/channel-list",
      "components/message-list/message-list",
      "components/qr-image/qr-image",
      "components/spinner-button/spinner-button",
      "components/signup-form/signup-form",
      "components/signin-form/signin-form",
      "components/cloud-connect-form/cloud-connect-form",
      "components/cloud-manage-form/cloud-manage-form"
    ],
    "npm:ramda@0.11.0/dist/ramda": [
      "github:jspm/nodelibs-process@0.1.1"
    ],
    "npm:core-js@0.9.6/library/fn/object/assign": [
      "npm:core-js@0.9.6/library/modules/es6.object.assign",
      "npm:core-js@0.9.6/library/modules/$"
    ],
    "npm:core-js@0.9.6/library/fn/map": [
      "npm:core-js@0.9.6/library/modules/es6.object.to-string",
      "npm:core-js@0.9.6/library/modules/es6.string.iterator",
      "npm:core-js@0.9.6/library/modules/web.dom.iterable",
      "npm:core-js@0.9.6/library/modules/es6.map",
      "npm:core-js@0.9.6/library/modules/es7.map.to-json",
      "npm:core-js@0.9.6/library/modules/$"
    ],
    "npm:node-forge@0.6.26/js/pki": [
      "npm:node-forge@0.6.26/js/asn1",
      "npm:node-forge@0.6.26/js/oids",
      "npm:node-forge@0.6.26/js/pbe",
      "npm:node-forge@0.6.26/js/pem",
      "npm:node-forge@0.6.26/js/pbkdf2",
      "npm:node-forge@0.6.26/js/pkcs12",
      "npm:node-forge@0.6.26/js/pss",
      "npm:node-forge@0.6.26/js/rsa",
      "npm:node-forge@0.6.26/js/util",
      "npm:node-forge@0.6.26/js/x509"
    ],
    "libraries/ionic/ionic": [
      "github:driftyco/ionic@1.0.0"
    ],
    "npm:baobab@1.0.2/src/baobab": [
      "npm:baobab@1.0.2/src/cursor",
      "npm:emmett@3.0.0",
      "npm:baobab@1.0.2/src/facet",
      "npm:baobab@1.0.2/src/helpers",
      "npm:baobab@1.0.2/src/update",
      "npm:baobab@1.0.2/src/merge",
      "npm:baobab@1.0.2/defaults",
      "npm:baobab@1.0.2/src/type"
    ],
    "libraries/qr-encode/qr-encode": [
      "github:angular/bower-angular@1.3.15",
      "npm:qr-encode@0.3.0"
    ],
    "npm:ramda@0.11.0": [
      "npm:ramda@0.11.0/dist/ramda"
    ],
    "npm:babel-runtime@5.2.6/core-js/object/assign": [
      "npm:core-js@0.9.6/library/fn/object/assign"
    ],
    "npm:babel-runtime@5.2.6/core-js/map": [
      "npm:core-js@0.9.6/library/fn/map"
    ],
    "npm:node-forge@0.6.26/js/tls": [
      "npm:node-forge@0.6.26/js/asn1",
      "npm:node-forge@0.6.26/js/hmac",
      "npm:node-forge@0.6.26/js/md",
      "npm:node-forge@0.6.26/js/pem",
      "npm:node-forge@0.6.26/js/pki",
      "npm:node-forge@0.6.26/js/random",
      "npm:node-forge@0.6.26/js/util"
    ],
    "npm:baobab@1.0.2/index": [
      "npm:baobab@1.0.2/src/baobab",
      "npm:baobab@1.0.2/src/helpers"
    ],
    "libraries/ramda/ramda": [
      "github:angular/bower-angular@1.3.15",
      "npm:ramda@0.11.0"
    ],
    "services/storage/storage-service": [
      "npm:babel-runtime@5.2.6/core-js/object/assign"
    ],
    "services/state/state-service": [
      "npm:babel-runtime@5.2.6/core-js/map"
    ],
    "npm:node-forge@0.6.26/js/aesCipherSuites": [
      "npm:node-forge@0.6.26/js/aes",
      "npm:node-forge@0.6.26/js/tls"
    ],
    "npm:baobab@1.0.2": [
      "npm:baobab@1.0.2/index"
    ],
    "services/storage/storage": [
      "github:angular/bower-angular@1.3.15",
      "libraries/remote-storage/remote-storage",
      "services/storage/storage-service"
    ],
    "services/state/state": [
      "github:angular/bower-angular@1.3.15",
      "services/storage/storage",
      "services/state/state-service"
    ],
    "npm:node-forge@0.6.26/js/forge": [
      "npm:node-forge@0.6.26/js/aes",
      "npm:node-forge@0.6.26/js/aesCipherSuites",
      "npm:node-forge@0.6.26/js/asn1",
      "npm:node-forge@0.6.26/js/cipher",
      "npm:node-forge@0.6.26/js/cipherModes",
      "npm:node-forge@0.6.26/js/debug",
      "npm:node-forge@0.6.26/js/des",
      "npm:node-forge@0.6.26/js/hmac",
      "npm:node-forge@0.6.26/js/kem",
      "npm:node-forge@0.6.26/js/log",
      "npm:node-forge@0.6.26/js/md",
      "npm:node-forge@0.6.26/js/mgf1",
      "npm:node-forge@0.6.26/js/pbkdf2",
      "npm:node-forge@0.6.26/js/pem",
      "npm:node-forge@0.6.26/js/pkcs7",
      "npm:node-forge@0.6.26/js/pkcs1",
      "npm:node-forge@0.6.26/js/pkcs12",
      "npm:node-forge@0.6.26/js/pki",
      "npm:node-forge@0.6.26/js/prime",
      "npm:node-forge@0.6.26/js/prng",
      "npm:node-forge@0.6.26/js/pss",
      "npm:node-forge@0.6.26/js/random",
      "npm:node-forge@0.6.26/js/rc2",
      "npm:node-forge@0.6.26/js/ssh",
      "npm:node-forge@0.6.26/js/task",
      "npm:node-forge@0.6.26/js/tls",
      "npm:node-forge@0.6.26/js/util"
    ],
    "libraries/baobab/baobab": [
      "github:angular/bower-angular@1.3.15",
      "npm:baobab@1.0.2"
    ],
    "services/contacts/contacts": [
      "github:angular/bower-angular@1.3.15",
      "libraries/ramda/ramda",
      "services/storage/storage",
      "services/contacts/contacts-service"
    ],
    "services/identity/identity": [
      "github:angular/bower-angular@1.3.15",
      "services/storage/storage",
      "services/state/state",
      "services/identity/identity-service"
    ],
    "npm:node-forge@0.6.26": [
      "npm:node-forge@0.6.26/js/forge"
    ],
    "libraries/libraries": [
      "github:angular/bower-angular@1.3.15",
      "libraries/ionic/ionic",
      "libraries/baobab/baobab",
      "libraries/angular-toastr/angular-toastr",
      "libraries/moment/moment",
      "libraries/ramda/ramda",
      "libraries/remote-storage/remote-storage",
      "libraries/qr-encode/qr-encode",
      "libraries/forge/forge",
      "libraries/telehash/telehash"
    ],
    "libraries/forge/forge": [
      "github:angular/bower-angular@1.3.15",
      "npm:node-forge@0.6.26"
    ],
    "services/cryptography/cryptography": [
      "github:angular/bower-angular@1.3.15",
      "libraries/forge/forge",
      "services/cryptography/cryptography-service"
    ],
    "services/services": [
      "github:angular/bower-angular@1.3.15",
      "services/contacts/contacts",
      "services/identity/identity",
      "services/navigation/navigation",
      "services/network/network",
      "services/notification/notification",
      "services/storage/storage",
      "services/cryptography/cryptography",
      "services/state/state",
      "services/time/time"
    ],
    "app": [
      "github:angular/bower-angular@1.3.15",
      "app.css!github:systemjs/plugin-css@0.1.10",
      "services/services",
      "libraries/libraries",
      "views/views",
      "components/components",
      "app-run",
      "app-config",
      "app-controller"
    ]
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.3.15",
    "angular-toastr": "npm:angular-toastr@1.3.1",
    "babel": "npm:babel-core@5.2.6",
    "babel-runtime": "npm:babel-runtime@5.2.6",
    "baobab": "npm:baobab@1.0.2",
    "core-js": "npm:core-js@0.9.6",
    "css": "github:systemjs/plugin-css@0.1.10",
    "driftyco/ionic": "github:driftyco/ionic@1.0.0",
    "moment": "npm:moment@2.10.2",
    "node-forge": "npm:node-forge@0.6.26",
    "plugin-text": "github:systemjs/plugin-text@0.0.2",
    "qr-encode": "npm:qr-encode@0.3.0",
    "ramda": "npm:ramda@0.11.0",
    "remotestoragejs": "npm:remotestoragejs@0.11.2",
    "scut": "npm:scut@1.1.2",
    "sinon": "npm:sinon@1.14.1",
    "text": "github:systemjs/plugin-text@0.0.2",
    "github:angular-ui/ui-router@0.2.15": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:angular/bower-angular-animate@1.3.15": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:angular/bower-angular-sanitize@1.3.15": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:driftyco/ionic@1.0.0": {
      "angular": "github:angular/bower-angular@1.3.15",
      "angular-animate": "github:angular/bower-angular-animate@1.3.15",
      "angular-sanitize": "github:angular/bower-angular-sanitize@1.3.15",
      "angular-ui-router": "github:angular-ui/ui-router@0.2.15"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.2.1"
    },
    "github:jspm/nodelibs-events@0.1.0": {
      "events-browserify": "npm:events-browserify@0.0.1"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
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
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:systemjs/plugin-css@0.1.10": {
      "clean-css": "npm:clean-css@3.1.9",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:amdefine@0.1.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:angular-toastr@1.3.1": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:baobab@1.0.2": {
      "emmett": "npm:emmett@3.0.0"
    },
    "npm:buffer@3.2.1": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.4",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:clean-css@3.1.9": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "commander": "npm:commander@2.6.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "source-map": "npm:source-map@0.1.43",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.6.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.6": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-util-is@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:events-browserify@0.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:formatio@1.1.1": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "samsam": "npm:samsam@1.1.2"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:moment@2.10.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:ramda@0.11.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:sinon@1.14.1": {
      "formatio": "npm:formatio@1.1.1",
      "lolex": "npm:lolex@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "util": "npm:util@0.10.3"
    },
    "npm:source-map@0.1.43": {
      "amdefine": "npm:amdefine@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

