let dependencies = [
  'ionic'
];

let dependenciesLoaded = dependencies.map((dependency) => {
  return System.import(dependency);
});

export default Promise.all(dependenciesLoaded).then((dependencies) => {
  return angular.module('toc', dependencies);
}).catch(console.log);