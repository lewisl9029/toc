/* */ 
var EventEmitter = require("emmett"),
    helpers = require("./helpers"),
    type = require("./type");
function bindCursor(c, cursor) {
  cursor.on('update', c.cursorListener);
}
function Combination(operator) {
  var self = this;
  if (arguments.length < 2)
    throw Error('baobab.Combination: not enough arguments.');
  var first = arguments[1],
      rest = helpers.arrayOf(arguments).slice(2);
  if (first instanceof Array) {
    rest = first.slice(1);
    first = first[0];
  }
  if (!type.Cursor(first))
    throw Error('baobab.Combination: argument should be a cursor.');
  if (operator !== 'or' && operator !== 'and')
    throw Error('baobab.Combination: invalid operator.');
  EventEmitter.call(this);
  this.cursors = [first];
  this.operators = [];
  this.root = first.root;
  this.updates = new Array(this.cursors.length);
  this.cursorListener = function() {
    self.updates[self.cursors.indexOf(this)] = true;
  };
  this.treeListener = function() {
    var shouldFire = self.updates[0],
        i,
        l;
    for (i = 1, l = self.cursors.length; i < l; i++) {
      shouldFire = self.operators[i - 1] === 'or' ? shouldFire || self.updates[i] : shouldFire && self.updates[i];
    }
    if (shouldFire)
      self.emit('update');
    self.updates = new Array(self.cursors.length);
  };
  this.root.on('update', this.treeListener);
  bindCursor(this, first);
  rest.forEach(function(cursor) {
    this[operator](cursor);
  }, this);
}
helpers.inherits(Combination, EventEmitter);
function makeOperator(operator) {
  Combination.prototype[operator] = function(cursor) {
    if (!type.Cursor(cursor))
      throw Error('baobab.Combination.' + operator + ': argument should be a cursor.');
    if (~this.cursors.indexOf(cursor))
      throw Error('baobab.Combination.' + operator + ': cursor already in combination.');
    this.cursors.push(cursor);
    this.operators.push(operator);
    this.updates.length++;
    bindCursor(this, cursor);
    return this;
  };
}
makeOperator('or');
makeOperator('and');
Combination.prototype.release = function() {
  this.kill();
  this.cursors.forEach(function(cursor) {
    cursor.off('update', this.cursorListener);
  }, this);
  this.root.off('update', this.treeListener);
  this.cursors = null;
  this.operators = null;
  this.root = null;
  this.updates = null;
};
module.exports = Combination;
