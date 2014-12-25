System.config({
  "paths": {
    "*": "*.js",
    "~/*": "/*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.3.8",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.13",
    "es6-shim": "github:paulmillr/es6-shim@0.22.1",
    "ionic": "github:driftyco/ionic-bower@0.9.26",
    "ramda": "github:ramda/ramda@0.8.0",
    "github:angular-ui/ui-router@0.2.13": {
      "angular": "github:angular/bower-angular@1.3.8"
    }
  }
});

