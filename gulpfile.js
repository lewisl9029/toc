/* jshint node: true */
var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var cssgrace = require('cssgrace');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var htmlhint = require('gulp-htmlhint');
var scsslint = require('gulp-scsslint');
var jsbeautifier = require('gulp-jsbeautifier');
var karma = require('karma')
  .server;
var argv = require('yargs')
  .argv;
var jspm = require('jspm');

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

gulp.task('default', ['build-sass']);

gulp.task('build', ['build-sass'], function build() {
  return jspm.bundle();
});

gulp.task('build-sass', function buildSass(done) {
  gulp.src('./www/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 version']
      }),
      cssgrace
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('watch', function watch() {
  gulp.watch(paths.sass, ['build-sass']);
});

gulp.task('test', ['lint'], function test(done) {
  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: argv.prod
  }, argv.prod ? done : undefined);
});

gulp.task('lint', ['lint-js', 'lint-html', 'lint-sass']);

gulp.task('lint-js', function lintJs() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint-html', function lintHtml() {
  return gulp.src(paths.html)
    .pipe(htmlhint({
      htmlhintrc: './.htmlhintrc'
    }))
    .pipe(htmlhint.reporter())
    .pipe(htmlhint.failReporter());
});

gulp.task('lint-sass', function lintSass() {
  return gulp.src(paths.sass)
    .pipe(scsslint())
    .pipe(scsslint.reporter())
    .pipe(scsslint.reporter('fail'));
});

gulp.task('style', ['style-js', 'style-html']);

var makeStyleTask = function makeStyleTask(paths) {
  var style = function style() {
    return gulp.src(paths, {
        base: './'
      })
      .pipe(jsbeautifier({
        config: './.jsbeautifyrc'
      }))
      .pipe(gulp.dest('./'));
  };

  return style;
};

gulp.task('style-js', makeStyleTask(paths.js));

gulp.task('style-html', makeStyleTask(paths.html));

//gulp.task('style-sass', makeStyleTask(paths.sass));
