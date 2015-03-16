/* */ 
var gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    header = require("gulp-header"),
    gjslint = require("gulp-gjslint");
var indexFile = './typology.js';
gulp.task('lint', function() {
  var jshintConfig = {
    '-W055': true,
    '-W040': true,
    '-W064': true,
    node: true,
    browser: true
  },
      gjslintConfig = {flags: ['--nojsdoc', '--disable 211,212']};
  return gulp.src(indexFile).pipe(jshint(jshintConfig)).pipe(jshint.reporter('jshint-stylish')).pipe(jshint.reporter('fail')).pipe(gjslint(gjslintConfig)).pipe(gjslint.reporter('console'), {fail: true});
});
gulp.task('build', function() {
  var banner = ['/**', ' * <%= pkg.name %> - <%= pkg.description %>', ' * @version v<%= pkg.version %>', ' * @link <%= pkg.homepage %>', ' * @license <%= pkg.license %>', ' */', ''].join('\n'),
      pkg = require("./package.json!systemjs-json");
  return gulp.src(indexFile).pipe(uglify()).pipe(header(banner, {pkg: pkg})).pipe(rename('typology.min.js')).pipe(gulp.dest('./'));
});
gulp.task('test', function() {
  return gulp.src('./test/unit.test.js').pipe(mocha({reporter: 'spec'}));
});
gulp.task('default', ['lint', 'test', 'build']);
