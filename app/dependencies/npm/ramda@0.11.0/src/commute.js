/* */ 
var commuteMap = require("./commuteMap");
var identity = require("./identity");
var map = require("./map");
module.exports = commuteMap(map(identity));
