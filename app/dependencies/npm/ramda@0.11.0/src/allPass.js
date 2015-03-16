/* */ 
var _all = require("./internal/_all");
var _predicateWrap = require("./internal/_predicateWrap");
var curry = require("./curry");
module.exports = curry(_predicateWrap(_all));
