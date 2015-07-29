/* */ 
(function(process) {
  var fs = require("fs");
  var packageJSON = require("../../package.json!systemjs-json");
  packageJSON.cordovaPlugins = packageJSON.cordovaPlugins || [];
  process.env.CORDOVA_PLUGINS.split(',').forEach(function(plugin) {
    var index = packageJSON.cordovaPlugins.indexOf(plugin);
    if (index > -1) {
      packageJSON.cordovaPlugins.splice(index, 1);
    }
  });
  fs.writeFile('package.json', JSON.stringify(packageJSON, null, 2));
})(require("process"));
