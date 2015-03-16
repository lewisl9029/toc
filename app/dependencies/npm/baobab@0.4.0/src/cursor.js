/* */ 
var EventEmitter = require("emmett"),
    Combination = require("./combination"),
    mixins = require("./mixins"),
    helpers = require("./helpers"),
    type = require("./type");
function Cursor(root, path, solvedPath, hash) {
  var self = this;
  EventEmitter.call(this);
  path = path || [];
  this.root = root;
  this.path = path;
  this.hash = hash;
  this.relevant = this.reference() !== undefined;
  this.complexPath = !!solvedPath;
  this.solvedPath = this.complexPath ? solvedPath : this.path;
  this.updateHandler = function(e) {
    var log = e.data.log,
        shouldFire = false,
        c,
        p,
        l,
        m,
        i,
        j;
    if (self.complexPath)
      self.solvedPath = helpers.solvePath(self.root.data, self.path);
    if (!this._handlers.update.length && !this._handlersAll.length)
      return ;
    if (!self.path.length)
      return self.emit('update');
    root: for (i = 0, l = log.length; i < l; i++) {
      c = log[i];
      for (j = 0, m = c.length; j < m; j++) {
        p = c[j];
        if (p !== '' + self.solvedPath[j])
          break;
        if (j + 1 === m || j + 1 === self.solvedPath.length) {
          shouldFire = true;
          break root;
        }
      }
    }
    var data = self.reference() !== undefined;
    if (self.relevant) {
      if (data && shouldFire) {
        self.emit('update');
      } else if (!data) {
        self.emit('irrelevant');
        self.relevant = false;
      }
    } else {
      if (data && shouldFire) {
        self.emit('relevant');
        self.emit('update');
        self.relevant = true;
      }
    }
  };
  this.root.on('update', this.updateHandler);
  this.mixin = mixins.cursor(this);
}
helpers.inherits(Cursor, EventEmitter);
Cursor.prototype.isRoot = function() {
  return !this.path.length;
};
Cursor.prototype.isLeaf = function() {
  return type.Primitive(this.reference());
};
Cursor.prototype.isBranch = function() {
  return !this.isLeaf() && !this.isRoot();
};
Cursor.prototype.select = function(path) {
  if (arguments.length > 1)
    path = helpers.arrayOf(arguments);
  if (!type.Path(path))
    throw Error('baobab.Cursor.select: invalid path.');
  return this.root.select(this.path.concat(path));
};
Cursor.prototype.up = function() {
  if (this.solvedPath && this.solvedPath.length)
    return this.root.select(this.path.slice(0, -1));
  else
    return null;
};
Cursor.prototype.left = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (isNaN(last))
    throw Error('baobab.Cursor.left: cannot go left on a non-list type.');
  return last ? this.root.select(this.solvedPath.slice(0, -1).concat(last - 1)) : null;
};
Cursor.prototype.leftmost = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (isNaN(last))
    throw Error('baobab.Cursor.leftmost: cannot go left on a non-list type.');
  return this.root.select(this.solvedPath.slice(0, -1).concat(0));
};
Cursor.prototype.right = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (isNaN(last))
    throw Error('baobab.Cursor.right: cannot go right on a non-list type.');
  if (last + 1 === this.up().reference().length)
    return null;
  return this.root.select(this.solvedPath.slice(0, -1).concat(last + 1));
};
Cursor.prototype.rightmost = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (isNaN(last))
    throw Error('baobab.Cursor.right: cannot go right on a non-list type.');
  var list = this.up().reference();
  return this.root.select(this.solvedPath.slice(0, -1).concat(list.length - 1));
};
Cursor.prototype.down = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (!(this.reference() instanceof Array))
    return null;
  return this.root.select(this.solvedPath.concat(0));
};
Cursor.prototype.get = function(path) {
  if (arguments.length > 1)
    path = helpers.arrayOf(arguments);
  if (type.Step(path))
    return this.root.get(this.solvedPath.concat(path));
  else
    return this.root.get(this.solvedPath);
};
Cursor.prototype.reference = function(path) {
  if (arguments.length > 1)
    path = helpers.arrayOf(arguments);
  if (type.Step(path))
    return this.root.reference(this.solvedPath.concat(path));
  else
    return this.root.reference(this.solvedPath);
};
Cursor.prototype.clone = function(path) {
  if (arguments.length > 1)
    path = helpers.arrayOf(arguments);
  if (type.Step(path))
    return this.root.clone(this.solvedPath.concat(path));
  else
    return this.root.clone(this.solvedPath);
};
Cursor.prototype.set = function(key, value) {
  if (arguments.length < 2)
    throw Error('baobab.Cursor.set: expecting at least key/value.');
  var spec = {};
  spec[key] = {$set: value};
  return this.update(spec);
};
Cursor.prototype.edit = function(value) {
  return this.update({$set: value});
};
Cursor.prototype.unset = function(key) {
  if (!key && key !== 0)
    throw Error('baobab.Cursor.unset: expects a valid key to unset.');
  var spec = {};
  spec[key] = {$unset: true};
  return this.update(spec);
};
Cursor.prototype.remove = function() {
  return this.update({$unset: true});
};
Cursor.prototype.apply = function(fn) {
  if (typeof fn !== 'function')
    throw Error('baobab.Cursor.apply: argument is not a function.');
  return this.update({$apply: fn});
};
Cursor.prototype.thread = function(fn) {
  if (typeof fn !== 'function')
    throw Error('baobab.Cursor.thread: argument is not a function.');
  return this.update({$thread: fn});
};
Cursor.prototype.push = function(value) {
  if (!(this.reference() instanceof Array))
    throw Error('baobab.Cursor.push: trying to push to non-array value.');
  if (arguments.length > 1)
    return this.update({$push: helpers.arrayOf(arguments)});
  else
    return this.update({$push: value});
};
Cursor.prototype.unshift = function(value) {
  if (!(this.reference() instanceof Array))
    throw Error('baobab.Cursor.push: trying to push to non-array value.');
  if (arguments.length > 1)
    return this.update({$unshift: helpers.arrayOf(arguments)});
  else
    return this.update({$unshift: value});
};
Cursor.prototype.merge = function(o) {
  if (!type.Object(o))
    throw Error('baobab.Cursor.merge: trying to merge a non-object.');
  if (!type.Object(this.reference()))
    throw Error('baobab.Cursor.merge: trying to merge into a non-object.');
  this.update({$merge: o});
};
Cursor.prototype.update = function(spec) {
  this.root.update(helpers.pathObject(this.solvedPath, spec));
  return this;
};
Cursor.prototype.or = function(otherCursor) {
  return new Combination('or', this, otherCursor);
};
Cursor.prototype.and = function(otherCursor) {
  return new Combination('and', this, otherCursor);
};
Cursor.prototype.release = function() {
  this.root.off('update', this.updateHandler);
  if (this.hash)
    delete this.root._cursors[this.hash];
  this.root = null;
  this.kill();
};
Cursor.prototype.toJSON = function() {
  return this.reference();
};
type.Cursor = function(value) {
  return value instanceof Cursor;
};
module.exports = Cursor;
