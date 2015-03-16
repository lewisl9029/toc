/* */ 
var _concat = require("./internal/_concat");
var _createPartialApplicator = require("./internal/_createPartialApplicator");
var curry = require("./curry");
var flip = require("./flip");
module.exports = curry(_createPartialApplicator(flip(_concat)));
