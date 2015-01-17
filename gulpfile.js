/* jshint node: true */
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var htmlhint = require('gulp-htmlhint');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var karma = require('karma').server;
var argv = require('yargs').argv;

var paths = {
  sass: [
    './www/components/**/*.scss',
    './www/views/**/*.scss',
    './www/app.scss'
  ],
  js: [
    './www/components/**/*.js',
    './www/libraries/**/*.js',
    './www/services/**/*.js',
    './www/views/**/*.js',
    './www/*.js',
    './*.js'
  ],
  html: [
    './www/components/**/*.html',
    './www/views/**/*.html',
    './www/*.html'
  ]
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./www/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('test', ['lint'], function(done) {
  gulp.src('./www/config.js')
    .pipe(replace('jspm_packages', 'www/jspm_packages'))
    .pipe(rename('config-test.js'))
    .pipe(gulp.dest('./www/'));

  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: argv.prod
  }, argv.prod ? done : undefined);
});

gulp.task('lint', function() {
  gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));

  gulp.src(paths.html)
    .pipe(htmlhint({
      htmlhintrc: './.htmlhintrc'
    }))
    .pipe(htmlhint.reporter())
    .pipe(htmlhint.failReporter());
});

gulp.task('style', function() {

});
