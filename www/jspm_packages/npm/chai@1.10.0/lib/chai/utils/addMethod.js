/* */ 
var config = require("../config");
var flag = require("./flag");
module.exports = function(ctx, name, method) {
  ctx[name] = function() {
    var old_ssfi = flag(this, 'ssfi');
    if (old_ssfi && config.includeStack === false)
      flag(this, 'ssfi', ctx[name]);
    var result = method.apply(this, arguments);
    return result === undefined ? this : result;
  };
};
