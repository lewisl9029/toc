/* */ 
var Baobab = require("./src/baobab"),
    Cursor = require("./src/cursor"),
    Facet = require("./src/facet"),
    helpers = require("./src/helpers");
Object.defineProperty(Baobab, 'version', {value: '1.1.1'});
Baobab.Cursor = Cursor;
Baobab.Facet = Facet;
Baobab.getIn = helpers.getIn;
module.exports = Baobab;
