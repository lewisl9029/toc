System.config({
  "paths": {
    "*": "*.js",
    "toc/*": "/*.js",
    "github:*": "dependencies/github/*.js",
    "npm:*": "dependencies/npm/*.js"
  },
  "transpiler": "6to5"
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.3.12",
    "css": "github:systemjs/plugin-css@0.1.0",
    "es6-shim": "github:paulmillr/es6-shim@0.22.1",
    "ionic": "github:driftyco/ionic-bower@1.0.0-beta.14",
    "plugin-text": "github:systemjs/plugin-text@0.0.2",
    "ramda": "github:ramda/ramda@0.8.0",
    "remotestorage.js": "github:remotestorage/remotestorage.js@0.11.1",
    "remotestorage.js@0.11.1": "github:remotestorage/remotestorage.js@0.11.1",
    "scut": "github:davidtheclark/scut@1.1.0",
    "sinon": "npm:sinon@1.12.2",
    "text": "github:systemjs/plugin-text@0.0.2",
    "github:angular/bower-angular-animate@1.3.12": {
      "angular": "github:angular/bower-angular@1.3.12"
    },
    "github:angular/bower-angular-sanitize@1.3.12": {
      "angular": "github:angular/bower-angular@1.3.12"
    },
    "github:driftyco/ionic-bower@1.0.0-beta.14": {
      "angular": "github:angular/bower-angular@1.3.12",
      "angular-animate": "github:angular/bower-angular-animate@1.3.12",
      "angular-sanitize": "github:angular/bower-angular-sanitize@1.3.12",
      "angular-ui-router": "github:angular-ui/ui-router@0.2.10"
    },
    "github:jspm/nodelibs-process@0.1.0": {
      "process": "npm:process@0.10.0"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
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
