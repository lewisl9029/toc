/* jshint node: true */
var gulp = require('gulp');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var htmlhint = require('gulp-htmlhint');
var scsslint = require('gulp-scsslint');
var jsbeautifier = require('gulp-jsbeautifier');
var minifyCss = require('gulp-minify-css');
var karma = require('karma').server;
var argv = require('yargs').argv;
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var del = require('del');
var ngAnnotate = require('gulp-ng-annotate');

// allows for watch to continue after errors
function handleError(error) {
  console.error(error);
  this.emit('end');
};

var basePaths = {
  dev: './app/',
  prod: './www/',
  mobile: './mobile/',
  platforms: './platforms/'
};

var paths = {
  sass: [
    basePaths.dev + 'components/**/*.scss',
    basePaths.dev + 'libraries/**/*.scss',
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
  ],
  asset: [
    basePaths.dev + 'assets/**'
  ]
};

gulp.task('watch', function watch() {
  gulp.watch(paths.sass, ['build-sass']);
});

gulp.task('serve', function serve() {
  var serveCommand = argv.prod ?
    'http-server www -p 8100' :
    // 'cd app && jspm-server --no-browser --port=8100 --ignore-exts=".scss"';
    'ionic serve --lab --address=$(hostname -i) -i 8101 --nobrowser';
  return gulp.src('')
    .pipe(shell(serveCommand));
});

gulp.task('clean', ['clean-build', 'clean-package']);

gulp.task('clean-build', function clean(done) {
  return del([
    basePaths.prod + '**'
  ], done);
});

gulp.task('clean-package', function cleanPackage(done) {
  return del([
    basePaths.mobile + '**'
  ], done);
});

gulp.task('build', function build(done) {
  return runSequence(
    'clean-build',
    'uncache-jspm',
    ['build-js', 'build-html', 'build-asset'],
    // 'cache-jspm',
    done
  );
});

gulp.task('package', ['build', 'clean-package'], function package() {
  return gulp.src('')
    .pipe(shell(
      'ionic build android && ' +
      'mkdir -p ' + basePaths.mobile + ' && ' +
      'cp ' + basePaths.platforms +
        'android/build/outputs/apk/* ' +
        basePaths.mobile
    ));
    //FIXME: release build throws error on install
    // .pipe(shell('ionic build android' + (argv.prod ? ' --release' : '')))
});

gulp.task('style', ['style-js', 'style-html']);

gulp.task('verify', ['test', 'lint']);

gulp.task('test', ['test-unit', 'test-e2e']);

gulp.task('lint', ['lint-js', 'lint-html', 'lint-sass']);

gulp.task('run', function run() {
  return gulp.src('')
    .pipe(shell(
      'ionic run --device --livereload --livereload-port 8101 ' +
      '--external-address $TOC_HOST_IP android'
    ));
});

gulp.task('build-js', ['build-jspm'], function buildJs() {
  return gulp.src([
      basePaths.dev + 'dependencies/system.src.js',
      basePaths.dev + 'jspm-config.js',
      basePaths.dev + 'initialize.js',
    ], {
      base: basePaths.dev
    })
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-jspm', ['bundle-jspm'], function buildJspm() {
  return gulp.src(basePaths.prod + 'app.js')
    .pipe(gulpif(argv.prod, ngAnnotate()))
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('bundle-jspm', ['build-sass'], function bundleJspm() {
  return gulp.src('')
    .pipe(shell([
      //clear depcache config first
      'jspm bundle app ' + basePaths.prod +
        'app.js --skip-source-maps'
    ]));
});

gulp.task('uncache-jspm', function uncacheJspm() {
  return gulp.src('')
    .pipe(shell([
      'jspm unbundle'
    ]));
});

gulp.task('cache-jspm', function cacheJspm() {
  return gulp.src('')
    .pipe(shell([
      'jspm depcache app'
    ]));
});

gulp.task('build-html', function buildHtml() {
  return gulp.src(basePaths.dev + 'index.html')
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-asset', function buildAsset() {
  return gulp.src(basePaths.dev + 'assets/**', {
      base: basePaths.dev
    })
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-sass', function buildSass() {
  //TODO: explore uncss viability
  return gulp.src([
      basePaths.dev + 'app.scss',
      basePaths.dev + 'initialize.scss'
    ])
    .pipe(gulpif(!argv.prod, sourcemaps.init()))
    .pipe(sass())
    .on('error', handleError)
    // .pipe(postcss([
    //   autoprefixer({
    //     browsers: ['last 2 version']
    //   })
    // ]))
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
    .pipe(gulpif(argv.prod, minifyCss()))
    .pipe(gulp.dest(basePaths.dev))
    .on('error', handleError)
    .pipe(gulp.dest(basePaths.prod))
    .on('error', handleError);
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
    .pipe(shell(
      'http-server ' + serverPath + ' -p 8100 -s & protractor;' +
      ' if [ $? != 0 ]; then pkill node && exit 1; else pkill node; fi'
    ));
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
