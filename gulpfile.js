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
var shell = require('gulp-shell');
var runSequence = require('run-sequence');
var del = require('del');

var basePaths = {
  dev: './app/',
  prod: './www/'
};

var paths = {
  sass: [
    basePaths.dev + 'components/**/*.scss',
    basePaths.dev + 'views/**/*.scss',
    basePaths.dev + 'app.scss',
    basePaths.dev + 'initialize.scss'
  ],
  js: [
    basePaths.dev + 'components/**/*.js',
    basePaths.dev + 'libraries/**/*.js',
    basePaths.dev + 'services/**/*.js',
    basePaths.dev + 'views/**/*.js',
    basePaths.dev + '*.js',
    './*.js'
  ],
  html: [
    basePaths.dev + 'components/**/*.html',
    basePaths.dev + 'views/**/*.html',
    basePaths.dev + '*.html'
  ]
};

gulp.task('watch', function watch() {
  gulp.watch(paths.sass, ['build-sass']);
});

gulp.task('clean', function clean(done) {
  return del([
    basePaths.prod + '**'
  ], done);
});

//TODO: add minification steps
//TODO: add android/ios/node-webkit build steps
//TODO: append version + latest folders for each build
gulp.task('build', function build(done) {
  return runSequence(
    'clean',
    ['build-js', 'build-html'],
    done
  );
});

gulp.task('style', ['style-js', 'style-html']);

gulp.task('verify', ['test', 'lint']);

gulp.task('test', ['test-unit', 'test-e2e']);

gulp.task('lint', ['lint-js', 'lint-html', 'lint-sass']);

gulp.task('build-js', ['build-sass'], function buildJs() {
  gulp.src('')
    .pipe(shell('jspm bundle app ' + basePaths.prod + 'app.js'));

  return gulp.src([
      basePaths.dev + 'dependencies/es6-module-loader.js',
      basePaths.dev + 'dependencies/es6-module-loader.js.map',
      basePaths.dev + 'dependencies/es6-module-loader.src.js',
      basePaths.dev + 'dependencies/system.js',
      basePaths.dev + 'dependencies/system.js.map',
      basePaths.dev + 'dependencies/system.src.js',
      basePaths.dev + 'config.js',
      basePaths.dev + 'initialize.js',
    ], {
      base: basePaths.dev
    })
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-html', function buildHtml() {
  return gulp.src(basePaths.dev + 'index.html')
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-sass', function buildSass() {
  //TODO: explore uncss viability
  gulp.src(basePaths.dev + 'initialize.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 version']
      })
      // FIXME: blocked by https://github.com/cssdream/cssgrace/issues/7
      //cssgrace
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(basePaths.dev))
    .pipe(gulp.dest(basePaths.prod));

  return gulp.src(basePaths.dev + 'app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 version']
      }),
      cssgrace
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(basePaths.dev))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('test-unit', function test(done) {
  var configFile = argv.prod ? 'karma-prod.conf.js' : 'karma.conf.js';
  return karma.start({
    configFile: __dirname + '/' + configFile,
    singleRun: !argv.dev
  }, done);
});

gulp.task('test-e2e', ['build-sass'], function test() {
  if (argv.ci) {
    return;
  }

  var serverPath = argv.prod ? basePaths.prod : basePaths.dev;

  return gulp.src('')
    .pipe(shell('bash -c "source protractor-test.sh ' + serverPath + '"'));
});

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
