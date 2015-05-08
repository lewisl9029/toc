/* */ 
var Cursor = require("./cursor"),
    EventEmitter = require("emmett"),
    Facet = require("./facet"),
    helpers = require("./helpers"),
    update = require("./update"),
    merge = require("./merge"),
    defaults = require("../defaults"),
    type = require("./type");
function complexHash(type) {
  return type + '$' + (new Date()).getTime() + ('' + Math.random()).replace('0.', '');
}
function Baobab(initialData, opts) {
  if (arguments.length < 1)
    initialData = {};
  if (!(this instanceof Baobab))
    return new Baobab(initialData, opts);
  if (!type.Object(initialData) && !type.Array(initialData))
    throw Error('Baobab: invalid data.');
  EventEmitter.call(this);
  this.options = helpers.shallowMerge(defaults, opts);
  this._transaction = {};
  this._future = undefined;
  this._cursors = {};
  this._identity = '[object Baobab]';
  this.data = helpers.deepClone(initialData);
  this.root = this.select([]);
  this.facets = {};
  function bootstrap(name) {
    this[name] = function() {
      var r = this.root[name].apply(this.root, arguments);
      return r instanceof Cursor ? this : r;
    };
  }
  ['get', 'set', 'unset', 'update'].forEach(bootstrap.bind(this));
  if (!type.Object(this.options.facets))
    throw Error('Baobab: invalid facets.');
  for (var k in this.options.facets)
    this.addFacet(k, this.options.facets[k]);
}
helpers.inherits(Baobab, EventEmitter);
Baobab.prototype.addFacet = function(name, definition, args) {
  this.facets[name] = this.createFacet(definition, args);
  return this;
};
Baobab.prototype.createFacet = function(definition, args) {
  return new Facet(this, definition, args);
};
Baobab.prototype.select = function(path) {
  if (arguments.length > 1)
    path = helpers.arrayOf(arguments);
  if (!type.Path(path))
    throw Error('Baobab.select: invalid path.');
  path = [].concat(path);
  var complex = type.ComplexPath(path);
  var solvedPath;
  if (complex)
    solvedPath = helpers.solvePath(this.data, path, this);
  var hash = path.map(function(step) {
    if (type.Function(step))
      return complexHash('fn');
    else if (type.Object(step))
      return complexHash('ob');
    else
      return step;
  }).join('|λ|');
  if (!this._cursors[hash]) {
    var cursor = new Cursor(this, path, solvedPath, hash);
    this._cursors[hash] = cursor;
    return cursor;
  } else {
    return this._cursors[hash];
  }
};
Baobab.prototype.stack = function(spec, skipMerge) {
  var self = this;
  if (!type.Object(spec))
    throw Error('Baobab.update: wrong specification.');
  this._transaction = (skipMerge && !Object.keys(this._transaction).length) ? spec : merge(this._transaction, spec);
  if (!this.options.autoCommit)
    return this;
  if (!this.options.asynchronous)
    return this.commit();
  if (!this._future)
    this._future = setTimeout(self.commit.bind(self, null), 0);
  return this;
};
Baobab.prototype.commit = function() {
  var self = this;
  var result = update(this.data, this._transaction, this.options);
  var oldData = this.data;
  this._transaction = {};
  if (this._future)
    this._future = clearTimeout(this._future);
  var validate = this.options.validate,
      behavior = this.options.validationBehavior;
  if (typeof validate === 'function') {
    var error = validate.call(this, oldData, result.data, result.log);
    if (error instanceof Error) {
      this.emit('invalid', {error: error});
      if (behavior === 'rollback')
        return this;
    }
  }
  this.data = result.data;
  this.emit('update', {
    log: result.log,
    previousState: oldData
  });
  return this;
};
Baobab.prototype.release = function() {
  var k;
  delete this.data;
  delete this._transaction;
  for (k in this._cursors)
    this._cursors[k].release();
  delete this._cursors;
  for (k in this.facets)
    this.facets[k].release();
  delete this.facets;
  this.kill();
};
Baobab.prototype.toJSON = function() {
  return this.get();
};
Baobab.prototype.toString = function() {
  return this._identity;
};
module.exports = Baobab;
