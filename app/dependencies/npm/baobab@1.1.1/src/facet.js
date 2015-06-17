/* */ 
var EventEmitter = require("emmett"),
    Cursor = require("./cursor"),
    helpers = require("./helpers"),
    type = require("./type");
function Facet(tree, definition, args) {
  var self = this;
  var firstTime = true,
      solved = false,
      getter = definition.get,
      facetData = null;
  EventEmitter.call(this);
  this.killed = false;
  this.tree = tree;
  this.cursors = {};
  this.facets = {};
  var cursorsMapping = definition.cursors,
      facetsMapping = definition.facets,
      complexCursors = typeof definition.cursors === 'function',
      complexFacets = typeof definition.facets === 'function';
  function refresh(complexity, targetMapping, targetProperty, mappingType, refreshArgs) {
    if (!complexity && !firstTime)
      return;
    solved = false;
    var solvedMapping = targetMapping;
    if (complexity)
      solvedMapping = targetMapping.apply(this, refreshArgs);
    if (!mappingType(solvedMapping))
      throw Error('baobab.Facet: incorrect ' + targetProperty + ' mapping.');
    self[targetProperty] = {};
    Object.keys(solvedMapping).forEach(function(k) {
      if (targetProperty === 'cursors') {
        if (solvedMapping[k] instanceof Cursor) {
          self.cursors[k] = solvedMapping[k];
          return;
        }
        if (type.Path(solvedMapping[k])) {
          self.cursors[k] = tree.select(solvedMapping[k]);
          return;
        }
      } else {
        if (solvedMapping[k] instanceof Facet) {
          self.facets[k] = solvedMapping[k];
          return;
        }
        if (typeof solvedMapping[k] === 'string') {
          self.facets[k] = tree.facets[solvedMapping[k]];
          if (!self.facets[k])
            throw Error('baobab.Facet: unkown "' + solvedMapping[k] + '" facet in facets mapping.');
          return;
        }
      }
    });
  }
  this.refresh = function(refreshArgs) {
    refreshArgs = refreshArgs || [];
    if (!type.Array(refreshArgs))
      throw Error('baobab.Facet.refresh: first argument should be an array.');
    if (cursorsMapping)
      refresh(complexCursors, cursorsMapping, 'cursors', type.FacetCursors, refreshArgs);
    if (facetsMapping)
      refresh(complexFacets, facetsMapping, 'facets', type.FacetFacets, refreshArgs);
  };
  this.get = function() {
    if (solved)
      return facetData;
    var data = {},
        k;
    for (k in self.facets)
      data[k] = self.facets[k].get();
    for (k in self.cursors)
      data[k] = self.cursors[k].get();
    data = typeof getter === 'function' ? getter.call(self, data) : data;
    solved = true;
    facetData = data;
    return facetData;
  };
  function cursorsPaths(cursors) {
    return Object.keys(cursors).map(function(k) {
      return cursors[k].solvedPath;
    });
  }
  function facetsPaths(facets) {
    var paths = Object.keys(facets).map(function(k) {
      return cursorsPaths(facets[k].cursors);
    });
    return [].concat.apply([], paths);
  }
  this.updateHandler = function(e) {
    if (self.killed)
      return;
    var paths = cursorsPaths(self.cursors).concat(facetsPaths(self.facets));
    if (helpers.solveUpdate(e.data.log, paths)) {
      solved = false;
      self.emit('update');
    }
  };
  this.refresh(args);
  this.tree.on('update', this.updateHandler);
  firstTime = false;
}
helpers.inherits(Facet, EventEmitter);
Facet.prototype.release = function() {
  this.tree.off('update', this.updateHandler);
  this.tree = null;
  this.cursors = null;
  this.facets = null;
  this.killed = true;
  this.kill();
};
module.exports = Facet;
