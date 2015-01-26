System.config({
  "paths": {
    "*": "*.js",
    "~/*": "/*.js",
    "github:*": "jspm_packages/github/*.js",
    "toc/*": "/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.3.9",
    "chai": "npm:chai@1.10.0",
    "css": "github:systemjs/plugin-css@0.1.0",
    "es6-shim": "github:paulmillr/es6-shim@0.22.1",
    "html": "github:systemjs/plugin-text@0.0.2",
    "ionic": "github:driftyco/ionic-bower@1.0.0-beta.14",
    "plugin-text": "github:systemjs/plugin-text@0.0.2",
    "ramda": "github:ramda/ramda@0.8.0",
    "remotestorage.js": "github:remotestorage/remotestorage.js@0.11.0",
    "scut": "github:davidtheclark/scut@1.0.2",
    "sinon": "npm:sinon@1.12.2",
    "github:angular/bower-angular-animate@1.3.9": {
      "angular": "github:angular/bower-angular@1.3.9"
    },
    "github:angular/bower-angular-sanitize@1.3.9": {
      "angular": "github:angular/bower-angular@1.3.9"
    },
    "github:driftyco/ionic-bower@1.0.0-beta.14": {
      "angular": "github:angular/bower-angular@1.3.9",
      "angular-animate": "github:angular/bower-angular-animate@1.3.9",
      "angular-sanitize": "github:angular/bower-angular-sanitize@1.3.9",
      "angular-ui-router": "github:angular-ui/ui-router@0.2.10"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.0.1"
    },
    "github:jspm/nodelibs-process@0.1.0": {
      "process": "npm:process@0.10.0"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:buffer@3.0.1": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.4",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:chai@1.10.0": {
      "assertion-error": "npm:assertion-error@1.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "deep-eql": "npm:deep-eql@0.1.3",
      "process": "github:jspm/nodelibs-process@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:deep-eql@0.1.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "type-detect": "npm:type-detect@0.1.1"
    },
    "npm:formatio@1.1.1": {
      "process": "github:jspm/nodelibs-process@0.1.0",
      "samsam": "npm:samsam@1.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:sinon@1.12.2": {
      "formatio": "npm:formatio@1.1.1",
      "lolex": "npm:lolex@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.0",
      "util": "npm:util@0.10.3"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.0"
    }
  }
});

