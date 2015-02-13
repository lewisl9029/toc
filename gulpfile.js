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
var run = require('gulp-run');

var basePaths = {
  dev: './app/',
  prod: './www/',
  platforms: './platforms/',
  plugins: './plugins/',
  engine: './engine/'
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

gulp.task('serve', function serve() {
  var serveCommand = argv.prod ?
    'http-server www -p 8100' :
    'ionic serve --lab --address=localhost -i 8101';
  return gulp.src('')
    .pipe(shell(serveCommand));
});

gulp.task('clean', ['clean-build', 'clean-package']);

gulp.task('clean-build', function clean(done) {
  return del([
    basePaths.prod + '**'
  ], done);
});

gulp.task('clean-package', function clean(done) {
  return del([
    basePaths.platforms + '**',
    basePaths.plugins + '**',
    basePaths.engine + '**'
  ], done);
});

//TODO: add node-webkit build steps
//TODO: append version + latest folders for each build
gulp.task('build', function build(done) {
  return runSequence(
    'clean-build',
    ['build-js', 'build-html'],
    done
  );
});

gulp.task('package', ['clean-package'], function package() {
  return gulp.src('')
    .pipe(shell(
      'cp -rf ' + process.env.TOC_BUILD_DEPS_PATH + '/* .'
    ))
    .pipe(shell('ionic build android'))
    .pipe(shell(
      'cp ' + basePaths.platforms +
        'android/build/outputs/apk/android-armv7-debug.apk ' + basePaths.prod
    ));
});

gulp.task('style', ['style-js', 'style-html']);

gulp.task('verify', ['test', 'lint']);

gulp.task('test', ['test-unit', 'test-e2e']);

gulp.task('lint', ['lint-js', 'lint-html', 'lint-sass']);



gulp.task('build-js', ['build-jspm'], function buildJs() {
  // gulp.src(basePaths.dev + 'app.js')
  //   .pipe(ngAnnotate())
  //   .pipe(gulp.dest(basePaths.dev));

  return gulp.src([
      basePaths.dev + 'dependencies/es6-module-loader.src.js',
      basePaths.dev + 'dependencies/system.src.js',
      basePaths.dev + 'config.js',
      basePaths.dev + 'initialize.js',
    ], {
      base: basePaths.dev
    })
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-jspm', ['build-sass'], function buildJspm() {
  return gulp.src('')
    .pipe(shell([
      'jspm bundle app ' + basePaths.prod +
        'app.js --minify --skip-source-maps --no-mangle'
    ]));
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
    .pipe(shell('http-server ' + serverPath + ' -p 8100 & protractor; pkill -f http-server'));
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
