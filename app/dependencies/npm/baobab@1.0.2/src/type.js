/* */ 
var type = {};
function anyOf(value, allowed) {
  return allowed.some(function(t) {
    return type[t](value);
  });
}
type.Array = function(value) {
  return Array.isArray(value);
};
type.Object = function(value) {
  return value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Function);
};
type.String = function(value) {
  return typeof value === 'string';
};
type.Number = function(value) {
  return typeof value === 'number';
};
type.PositiveInteger = function(value) {
  return typeof value === 'number' && value > 0 && value % 1 === 0;
};
type.Function = function(value) {
  return typeof value === 'function';
};
type.Primitive = function(value) {
  return !value || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
};
type.Date = function(value) {
  return value instanceof Date;
};
type.NonScalar = function(value) {
  return type.Object(value) || type.Array(value);
};
type.Splicer = function(value) {
  return type.Array(value) && value.every(type.Array);
};
type.Path = function(value, allowed) {
  allowed = allowed || ['String', 'Number', 'Function', 'Object'];
  if (type.Array(value)) {
    return value.every(function(step) {
      return anyOf(step, allowed);
    });
  } else {
    return anyOf(value, allowed);
  }
};
type.ComplexPath = function(value) {
  return value.some(function(step) {
    return anyOf(step, ['Object', 'Function']);
  });
};
type.FacetCursors = function(value) {
  if (!type.Object(value))
    return false;
  return Object.keys(value).every(function(k) {
    var v = value[k];
    return type.Path(v, ['String', 'Number', 'Object']) || v instanceof require("./cursor");
  });
};
type.FacetFacets = function(value) {
  if (!type.Object(value))
    return false;
  return Object.keys(value).every(function(k) {
    var v = value[k];
    return typeof v === 'string' || v instanceof require("./facet");
  });
};
module.exports = type;
