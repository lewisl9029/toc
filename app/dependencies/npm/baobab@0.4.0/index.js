/* */ 
var Baobab = require("./src/baobab"),
    helpers = require("./src/helpers");
Object.defineProperty(Baobab, 'version', {value: '0.4.0'});
Baobab.getIn = helpers.getIn;
module.exports = Baobab;
