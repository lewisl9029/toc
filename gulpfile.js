var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var karma = require('karma').server;
var argv = require('yargs').argv;

var paths = {
  sass: [
    './www/components/**/*.scss',
    './www/views/**/*.scss',
    './www/app.scss'
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

gulp.task('test', function(done) {
  gulp.src('./www/config.js')
    .pipe(replace('jspm_packages', 'www/jspm_packages'))
    .pipe(rename('config-test.js'))
    .pipe(gulp.dest('./www/'));

  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: argv.prod
  }, done);
});