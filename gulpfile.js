/* jshint node: true */
var gulp = require('gulp');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var imagemin = require('gulp-imagemin');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
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

// fixes runsequence always exiting with 0 even on errors
// http://dev.topheman.com/gulp-fail-run-sequence-with-a-correct-exit-code/
var handleSequenceError = function (error, done) {
  //if any error happened in the previous tasks, exit with a code > 0
  if (error) {
    var exitCode = 1;
    console.log('[ERROR] gulp sequenced task failed', error);
    console.log('[FAIL] gulp sequenced task failed - exiting with code ' + exitCode);
    return process.exit(exitCode);
  }
  else {
    return done();
  }
};

var basePaths = {
  dev: './toc/',
  devApp: './toc/app/',
  prod: './www/',
  prodApp: './www/app/',
  mobile: './mobile/',
  platforms: './platforms/'
};

var paths = {
  sass: {
    app: [
      basePaths.devApp + 'components/**/*.scss',
      basePaths.devApp + 'libraries/**/*.scss',
      basePaths.devApp + 'views/**/*.scss',
      basePaths.devApp + 'app.scss'
    ],
    init: [
      basePaths.devApp + 'initialize.scss'
    ],
    landing: [
      basePaths.dev + 'landing.scss'
    ]
  },
  js: [
    basePaths.devApp + 'components/**/*.js',
    basePaths.devApp + 'libraries/**/*.js',
    basePaths.devApp + 'services/**/*.js',
    basePaths.devApp + 'views/**/*.js',
    basePaths.devApp + '*.js',
    basePaths.dev + '*.js',
    './*.js'
  ],
  html: [
    basePaths.devApp + 'components/**/*.html',
    basePaths.devApp + 'views/**/*.html',
    basePaths.devApp + '*.html',
    basePaths.dev + '*.html'
  ],
  asset: [
    basePaths.devApp + 'assets/**'
  ]
};

gulp.task('watch', function watch() {
  gulp.watch(paths.sass.app, ['bundle-sass-app']);
  gulp.watch(paths.sass.init, ['bundle-sass-init']);
  gulp.watch(paths.sass.landing, ['bundle-sass-landing']);
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

gulp.task('build', function build(done) {
  return runSequence(
    'clean-build',
    'uncache-jspm',
    ['build-js', 'build-html', 'build-sass', 'build-asset'],
    // 'cache-jspm',
    function (error) {
      return handleSequenceError(error, done);
    }
  );
});

gulp.task('package', function package(done) {
  var handlePackageError = function (error) {
    runSequence(
      ['uninject-cordova', 'unfix-ionic'],
      function() {
        return handleSequenceError(error, done);
      }
    );
  };

  if (argv['skip-build']) {
    return runSequence(
      ['inject-cordova', 'fix-ionic'],
      ['package-android'],
      ['uninject-cordova', 'unfix-ionic'],
      handlePackageError
    );
  }
  return runSequence(
    'build',
    ['inject-cordova', 'fix-ionic'],
    ['package-android'],
    ['uninject-cordova', 'unfix-ionic'],
    handlePackageError
  );
});

gulp.task('inject-cordova', function injectCordova() {
  return gulp.src([
      basePaths.prodApp + 'index.html'
    ], {
      base: basePaths.prodApp
    })
    .pipe(replace(
      '</body>',
      '<script src="../cordova.js"></script></body>'
    ))
    .pipe(gulp.dest(basePaths.prodApp));
});

gulp.task('uninject-cordova', function injectCordova() {
  return gulp.src([
      basePaths.prodApp + 'index.html'
    ], {
      base: basePaths.prodApp
    })
    .pipe(replace(
      '<script src="../cordova.js"></script></body>',
      '</body>'
    ))
    .pipe(gulp.dest(basePaths.prodApp));
});

gulp.task('fix-ionic', function fixIonic() {
  //FIXME: workaround for
  // https://github.com/driftyco/ionic-cli/issues/620
  return gulp.src('ionic.project')
    .pipe(replace(
      '"documentRoot": "toc"',
      '"documentRoot": "www"'
    ))
    .pipe(gulp.dest('./'));
});

gulp.task('unfix-ionic', function unfixIonic() {
  return gulp.src('ionic.project')
    .pipe(replace(
      '"documentRoot": "www"',
      '"documentRoot": "toc"'
    ))
    .pipe(gulp.dest('./'));
});

gulp.task('package-android', function packageAndroid() {
  return gulp.src('')
    .pipe(shell(
      'ionic package build android'
    ));
});

gulp.task('run', function run() {
  return gulp.src('')
    .pipe(shell(
      'ionic run --device --livereload --livereload-port 8101 ' +
        '--external-address $TOC_HOST_IP android'
    ));
});

gulp.task('build-js', ['replace-js', 'build-jspm'], function buildJs() {
  return gulp.src([
      basePaths.devApp + 'dependencies/system-csp-production.src.js',
      basePaths.devApp + 'dependencies/system-polyfills.js',
      basePaths.devApp + 'jspm-config.js'
    ], {
      base: basePaths.dev
    })
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('replace-js', function replaceJs() {
  var tocVersion = require('./package.json').version;
  return gulp.src([
      basePaths.devApp + 'initialize.js',
      basePaths.dev + 'landing.js'
    ], {
      base: basePaths.dev
    })
    .pipe(replace(
      'window.tocVersion = \'dev\';',
      'window.tocVersion = \'' + tocVersion + '\';'
    ))
    .pipe(gulpif(argv.prod, replace(
      'window.tocProd = false',
      'window.tocProd = true'
    )))
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-jspm', ['bundle-jspm'], function buildJspm() {
  return gulp.src(basePaths.prodApp + 'app.js')
    .pipe(gulpif(argv.prod, ngAnnotate()))
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(gulp.dest(basePaths.prodApp));
});

gulp.task('bundle-jspm', function bundleJspm() {
  return gulp.src('')
    .pipe(shell([
      //clear depcache config first
      'jspm bundle app ' + basePaths.prodApp +
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

gulp.task('build-html', ['replace-html'], function buildHtml() {
  return gulp.src([
      basePaths.dev + 'index.html'
    ], {
      base: basePaths.dev
    })
    .pipe(gulpif(argv.prod, minifyHtml()))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('replace-html', function replaceHtml() {
  return gulp.src([
      basePaths.devApp + 'index.html'
    ], {
      base: basePaths.dev
    })
    .pipe(replace(
      'dependencies/system.src.js',
      'dependencies/system-csp-production.src.js'
    ))
    .pipe(gulpif(argv.prod, minifyHtml()))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-asset', ['build-image', 'build-font']);

gulp.task('build-font', , function buildFont() {
  return gulp.src([
      basePaths.devApp + 'assets/fonts/**'
    ], {
      base: basePaths.dev
    })
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-image', function buildImage() {
  return gulp.src([
      basePaths.devApp + 'assets/images/**'
    ], {
      base: basePaths.dev
    })
    .pipe(gulpif(argv.prod, imagemin({
      optimizationLevel: 7,
      multipass: true
    })))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-sass', ['bundle-sass'], function buildSass() {
  return gulp.src([
      basePaths.devApp + 'app.css',
      basePaths.devApp + 'initialize.css',
      basePaths.dev + 'landing.css'
    ], {
      base: basePaths.dev
    })
    .pipe(gulp.dest(basePaths.prod))
    .on('error', handleError);
});

gulp.task('bundle-sass', [
  'bundle-sass-app',
  'bundle-sass-init',
  'bundle-sass-landing'
]);

var makeSassTask = function makeSassTask(sassPath) {
  return gulp.src(sassPath, { base: basePaths.dev })
    .pipe(gulpif(!argv.prod, sourcemaps.init()))
    .pipe(sass())
    .on('error', handleError)
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
    .pipe(gulpif(argv.prod, minifyCss()))
    .pipe(gulp.dest(basePaths.dev))
    .on('error', handleError);
};

gulp.task('bundle-sass-app', function bundleSass() {
  return makeSassTask(basePaths.devApp + 'app.scss');
});

gulp.task('bundle-sass-init', function bundleSass() {
  return makeSassTask(basePaths.devApp + 'initialize.scss');
});

gulp.task('bundle-sass-landing', function bundleSass() {
  return makeSassTask(basePaths.dev + 'landing.scss');
});
