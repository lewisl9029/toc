/* */ 
var flag = require("./flag");
module.exports = function(obj, args) {
  var negate = flag(obj, 'negate'),
      expr = args[0];
  return negate ? !expr : expr;
};
