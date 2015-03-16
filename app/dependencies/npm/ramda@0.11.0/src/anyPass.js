/* */ 
var _any = require("./internal/_any");
var _predicateWrap = require("./internal/_predicateWrap");
var curry = require("./curry");
module.exports = curry(_predicateWrap(_any));
