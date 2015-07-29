/* */ 
(function(process) {
  var exec = require("child_process").exec;
  var path = require("path");
  var sys = require("sys");
  var packageJSON = require("../../package.json!systemjs-json");
  var cmd = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
  packageJSON.cordovaPlugins = packageJSON.cordovaPlugins || [];
  packageJSON.cordovaPlugins.forEach(function(plugin) {
    exec('cordova plugin add ' + plugin, function(error, stdout, stderr) {
      sys.puts(stdout);
    });
  });
})(require("process"));
