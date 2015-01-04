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
    "angular": "github:angular/bower-angular@1.3.8",
    "es6-shim": "github:paulmillr/es6-shim@0.22.1",
    "ionic": "github:driftyco/ionic-bower@1.0.0-beta.14",
    "ramda": "github:ramda/ramda@0.8.0",
    "github:angular/bower-angular-animate@1.3.8": {
      "angular": "github:angular/bower-angular@1.3.8"
    },
    "github:angular/bower-angular-sanitize@1.3.8": {
      "angular": "github:angular/bower-angular@1.3.8"
    },
    "github:driftyco/ionic-bower@1.0.0-beta.14": {
      "angular": "github:angular/bower-angular@1.3.8",
      "angular-animate": "github:angular/bower-angular-animate@1.3.8",
      "angular-sanitize": "github:angular/bower-angular-sanitize@1.3.8",
      "angular-ui-router": "github:angular-ui/ui-router@0.2.10",
      "css": "github:systemjs/plugin-css@0.1.0"
    }
  }
});
