/* */ 
(function(process) {
  module.exports = System._nodeRequire ? process : require("process");
})(require("process"));
