/* */ 
var Baobab = require("./src/baobab"),
    helpers = require("./src/helpers");
Object.defineProperty(Baobab, 'version', {value: '1.0.2'});
Baobab.getIn = helpers.getIn;
module.exports = Baobab;
