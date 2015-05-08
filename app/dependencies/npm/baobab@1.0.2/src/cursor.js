/* */ 
var EventEmitter = require("emmett"),
    helpers = require("./helpers"),
    defaults = require("../defaults"),
    type = require("./type");
function Cursor(tree, path, solvedPath, hash) {
  var self = this;
  EventEmitter.call(this);
  path = path || [];
  this.tree = tree;
  this.path = path;
  this.hash = hash;
  this.archive = null;
  this.recording = false;
  this.undoing = false;
  this._identity = '[object Cursor]';
  this.complexPath = !!solvedPath;
  this.solvedPath = this.complexPath ? solvedPath : this.path;
  this.relevant = this.get() !== undefined;
  function update(previousState) {
    if (self.recording && !self.undoing) {
      var record = helpers.getIn(previousState, self.solvedPath, self.tree);
      self.archive.add(record);
    }
    self.undoing = false;
    return self.emit('update');
  }
  this.updateHandler = function(e) {
    var log = e.data.log,
        previousState = e.data.previousState,
        shouldFire = false,
        c,
        p,
        l,
        m,
        i,
        j;
    if (self.complexPath)
      self.solvedPath = helpers.solvePath(self.tree.data, self.path, self.tree);
    if (!self.path.length)
      return update(previousState);
    if (self.solvedPath)
      shouldFire = helpers.solveUpdate(log, [self.solvedPath]);
    var data = self.get() !== undefined;
    if (self.relevant) {
      if (data && shouldFire) {
        update(previousState);
      } else if (!data) {
        self.emit('irrelevant');
        self.relevant = false;
      }
    } else {
      if (data && shouldFire) {
        self.emit('relevant');
        update(previousState);
        self.relevant = true;
      }
    }
  };
  var bound = false;
  this._lazyBind = function() {
    if (bound)
      return ;
    bound = true;
    self.tree.on('update', self.updateHandler);
  };
  this.on = helpers.before(this._lazyBind, this.on.bind(this));
  this.once = helpers.before(this._lazyBind, this.once.bind(this));
  if (this.complexPath)
    this._lazyBind();
}
helpers.inherits(Cursor, EventEmitter);
Cursor.prototype.isRoot = function() {
  return !this.path.length;
};
Cursor.prototype.isLeaf = function() {
  return type.Primitive(this.get());
};
Cursor.prototype.isBranch = function() {
  return !this.isLeaf() && !this.isRoot();
};
Cursor.prototype.root = function() {
  return this.tree.root();
};
Cursor.prototype.select = function(path) {
  if (arguments.length > 1)
    path = helpers.arrayOf(arguments);
  if (!type.Path(path))
    throw Error('baobab.Cursor.select: invalid path.');
  return this.tree.select(this.path.concat(path));
};
Cursor.prototype.up = function() {
  if (this.solvedPath && this.solvedPath.length)
    return this.tree.select(this.path.slice(0, -1));
  else
    return null;
};
Cursor.prototype.left = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (isNaN(last))
    throw Error('baobab.Cursor.left: cannot go left on a non-list type.');
  return last ? this.tree.select(this.solvedPath.slice(0, -1).concat(last - 1)) : null;
};
Cursor.prototype.leftmost = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (isNaN(last))
    throw Error('baobab.Cursor.leftmost: cannot go left on a non-list type.');
  return this.tree.select(this.solvedPath.slice(0, -1).concat(0));
};
Cursor.prototype.right = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (isNaN(last))
    throw Error('baobab.Cursor.right: cannot go right on a non-list type.');
  if (last + 1 === this.up().get().length)
    return null;
  return this.tree.select(this.solvedPath.slice(0, -1).concat(last + 1));
};
Cursor.prototype.rightmost = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (isNaN(last))
    throw Error('baobab.Cursor.right: cannot go right on a non-list type.');
  var list = this.up().get();
  return this.tree.select(this.solvedPath.slice(0, -1).concat(list.length - 1));
};
Cursor.prototype.down = function() {
  var last = +this.solvedPath[this.solvedPath.length - 1];
  if (!(this.get() instanceof Array))
    return null;
  return this.tree.select(this.solvedPath.concat(0));
};
Cursor.prototype.get = function(path) {
  if (arguments.length > 1)
    path = helpers.arrayOf(arguments);
  var fullPath = this.solvedPath.concat([].concat(path || path === 0 ? path : []));
  return helpers.getIn(this.tree.data, fullPath, this.tree);
};
function pathPolymorphism(method, allowedType, key, val) {
  if (arguments.length > 5)
    throw Error('baobab.Cursor.' + method + ': too many arguments.');
  if (method === 'unset') {
    val = true;
    if (arguments.length === 2)
      key = [];
  } else if (arguments.length < 4) {
    val = key;
    key = [];
  }
  if (!type.Path(key))
    throw Error('baobab.Cursor.' + method + ': invalid path "' + key + '".');
  if (method === 'splice' && !type.Splicer(val)) {
    if (type.Array(val))
      val = [val];
    else
      throw Error('baobab.Cursor.splice: incorrect value.');
  }
  if (allowedType && !allowedType(val))
    throw Error('baobab.Cursor.' + method + ': incorrect value.');
  var path = [].concat(key),
      solvedPath = helpers.solvePath(this.get(), path, this.tree);
  if (!solvedPath)
    throw Error('baobab.Cursor.' + method + ': could not solve dynamic path.');
  var leaf = {};
  leaf['$' + method] = val;
  var spec = helpers.pathObject(solvedPath, leaf);
  return spec;
}
function makeUpdateMethod(command, type) {
  Cursor.prototype[command] = function() {
    var spec = pathPolymorphism.bind(this, command, type).apply(this, arguments);
    return this.update(spec, true);
  };
}
makeUpdateMethod('set');
makeUpdateMethod('apply', type.Function);
makeUpdateMethod('chain', type.Function);
makeUpdateMethod('push');
makeUpdateMethod('unshift');
makeUpdateMethod('merge', type.Object);
makeUpdateMethod('splice');
Cursor.prototype.unset = function(key) {
  if (key === undefined && this.isRoot())
    throw Error('baobab.Cursor.unset: cannot remove root node.');
  var spec = pathPolymorphism.bind(this, 'unset', null).apply(this, arguments);
  return this.update(spec, true);
};
Cursor.prototype.update = function(spec, skipMerge) {
  if (!type.Object(spec))
    throw Error('baobab.Cursor.update: invalid specifications.');
  this.tree.stack(helpers.pathObject(this.solvedPath, spec), skipMerge);
  return this;
};
Cursor.prototype.startRecording = function(maxRecords) {
  maxRecords = maxRecords || 5;
  if (maxRecords < 1)
    throw Error('baobab.Cursor.startRecording: invalid maximum number of records.');
  if (this.archive)
    return this;
  this._lazyBind();
  this.archive = helpers.archive(maxRecords);
  this.recording = true;
  return this;
};
Cursor.prototype.stopRecording = function() {
  this.recording = false;
  return this;
};
Cursor.prototype.undo = function(steps) {
  steps = steps || 1;
  if (!this.recording)
    throw Error('baobab.Cursor.undo: cursor is not recording.');
  if (!type.PositiveInteger(steps))
    throw Error('baobab.Cursor.undo: expecting a positive integer.');
  var record = this.archive.back(steps);
  if (!record)
    throw Error('boabab.Cursor.undo: cannot find a relevant record (' + steps + ' back).');
  this.undoing = true;
  return this.set(record);
};
Cursor.prototype.hasHistory = function() {
  return !!(this.archive && this.archive.get().length);
};
Cursor.prototype.getHistory = function() {
  return this.archive ? this.archive.get() : [];
};
Cursor.prototype.clearHistory = function() {
  this.archive = null;
  return this;
};
Cursor.prototype.release = function() {
  this.tree.off('update', this.updateHandler);
  if (this.hash)
    delete this.tree._cursors[this.hash];
  delete this.tree;
  delete this.path;
  delete this.solvedPath;
  delete this.archive;
  this.kill();
};
Cursor.prototype.toJSON = function() {
  return this.get();
};
Cursor.prototype.toString = function() {
  return this._identity;
};
module.exports = Cursor;
