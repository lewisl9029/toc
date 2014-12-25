"use strict";
Object.defineProperties(exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
var dependencies = ['ionic'];
var dependenciesLoaded = dependencies.map((function(dependency) {
  return System.import(dependency);
}));
var $__default = Promise.all(dependenciesLoaded).then((function(dependencies) {
  return angular.module('toc', dependencies);
})).catch(console.log);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBkZXBlbmRlbmNpZXMgPSBbXHJcbiAgJ2lvbmljJ1xyXG5dO1xyXG5cclxubGV0IGRlcGVuZGVuY2llc0xvYWRlZCA9IGRlcGVuZGVuY2llcy5tYXAoKGRlcGVuZGVuY3kpID0+IHtcclxuICByZXR1cm4gU3lzdGVtLmltcG9ydChkZXBlbmRlbmN5KTtcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9taXNlLmFsbChkZXBlbmRlbmNpZXNMb2FkZWQpLnRoZW4oKGRlcGVuZGVuY2llcykgPT4ge1xyXG4gIHJldHVybiBhbmd1bGFyLm1vZHVsZSgndG9jJywgZGVwZW5kZW5jaWVzKTtcclxufSkuY2F0Y2goY29uc29sZS5sb2cpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==