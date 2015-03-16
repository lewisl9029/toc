/* */ 
var _map = require("./internal/_map");
var identity = require("./identity");
var pickAll = require("./pickAll");
var useWith = require("./useWith");
module.exports = useWith(_map, pickAll, identity);
