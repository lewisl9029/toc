/* */ 
(function(process) {
  var fs = require("fs");
  var packageJSON = require("../../package.json!systemjs-json");
  packageJSON.cordovaPlugins = packageJSON.cordovaPlugins || [];
  process.env.CORDOVA_PLUGINS.split(',').forEach(function(plugin) {
    if (packageJSON.cordovaPlugins.indexOf(plugin) == -1) {
      packageJSON.cordovaPlugins.push(plugin);
    }
  });
  fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2));
})(require("process"));
