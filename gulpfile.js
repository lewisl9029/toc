/* jshint node: true */
var gulp = require('gulp');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var argv = require('yargs').argv;
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
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
    var exitCode = 2;
    console.log('[ERROR] gulp sequenced task failed', error);
    console.log('[FAIL] gulp sequenced task failed - exiting with code ' + exitCode);
    return process.exit(exitCode);
  }
  else {
    return done();
  }
};

var basePaths = {
  root: './',
  dev: './toc/',
  devApp: './toc/app/',
  prod: './www/',
  prodApp: './www/app/',
  mobile: './mobile/',
  platforms: './platforms/',
  cordova: './cordova-bundles/'
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
    basePaths.root + '*.js'
  ],
  html: [
    basePaths.devApp + 'components/**/*.html',
    basePaths.devApp + 'views/**/*.html',
    basePaths.devApp + '*.html',
    basePaths.dev + '*.html'
  ],
  asset: [
    basePaths.devApp + 'assets/**'
  ],
  cordova: [
    basePaths.cordova + 'android/cordova.js',
    basePaths.cordova + 'android/plugins/*.js'
  ]
};

gulp.task('nil');

gulp.task('watch', function watch() {
  gulp.watch(paths.sass.app, ['bundle-sass-app']);
  gulp.watch(paths.sass.init, ['bundle-sass-init']);
  gulp.watch(paths.sass.landing, ['bundle-sass-landing']);
});

gulp.task('version', function version() {
  var tocVersion = require('./package.json').version;
  return gulp.src(basePaths.root + 'config.xml')
    .pipe(replace(
      /<widget id="net\.lewisl\.toc" version="[0-9]+(\.[0-9]+)*"/,
      '<widget id="net.lewisl.toc" version="' + tocVersion + '"'
    ))
    .pipe(gulp.dest(basePaths.root));
});

gulp.task('serve', function serve() {
  var serveCommand = argv.prod ?
    'http-server www -p 8100' :
    // 'cd app && jspm-server --no-browser --port=8100 --ignore-exts=".scss"';
    'ionic serve --lab ' +
      '--address=$(hostname -i) -i 8101 --nobrowser --nocordovamock';
  return gulp.src('')
    .pipe(shell(serveCommand));
});

gulp.task('clean', ['clean-build', 'clean-package']);

gulp.task('clean-build', function clean() {
  return gulp.src('')
    .pipe(shell('rm -rf ' + basePaths.prod));
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
      ['uninject-cordova', 'uninject-livereload', 'unfix-ionic'],
      function() {
        return handleSequenceError(error, done);
      }
    );
  };

  if (argv.dev) {
    var packageAndroidTask = argv.packagedev ?
      ['package-android'] :
      ['nil'];
    var packageIosTask = argv.packagedev ?
      ['package-ios'] :
      ['nil'];

    var downloadTask = argv.packagedev ?
      (argv.skipdownload ? ['nil'] : ['download']) :
      ['nil'];

    return runSequence(
      ['inject-cordova', 'inject-livereload', 'fix-ionic'],
      packageIosTask,
      packageAndroidTask,
      ['unfix-ionic', 'uninject-livereload'],
      downloadTask,
      ['serve'],
      ['uninject-cordova'],
      handlePackageError
    );
  }

  var buildTask = argv.skipbuild ? ['nil'] : ['build'];
  var downloadTask = argv.skipdownload ? ['nil'] : ['download'];

  return runSequence(
    buildTask,
    ['inject-cordova', 'fix-ionic'],
    ['package-ios'],
    ['package-android'],
    ['uninject-cordova', 'unfix-ionic'],
    downloadTask,
    handlePackageError
  );
});

gulp.task('package-android', function packageAndroid() {
  var packageCommandDev = '/bin/bash scripts/toc-package-android.sh';
  var packageCommandProd = packageCommandDev + ' prod';

  var packageCommand = argv.prod ? packageCommandProd : packageCommandDev;
  return gulp.src('')
    .pipe(shell(packageCommand));
});

gulp.task('package-ios', function packageIos() {
  var packageCommandDev = '/bin/bash scripts/toc-package-ios.sh';
  var packageCommandProd = packageCommandDev + ' prod';

  var packageCommand = argv.prod ? packageCommandProd : packageCommandDev;
  return gulp.src('')
    .pipe(shell(packageCommand));
});

gulp.task('download', ['download-android', 'download-ios']);

gulp.task('download-android', function downloadAndroid() {
  return gulp.src('')
    .pipe(shell('/bin/bash scripts/toc-package-download.sh android'));
});

gulp.task('download-ios', function downloadIos() {
  return gulp.src('')
    .pipe(shell('/bin/bash scripts/toc-package-download.sh ios'));
});

gulp.task('inject-livereload', function injectLivereload() {
  var hostIp = process.env['TOC_HOST_IP'] || argv.hostip;

  if (!hostIp) {
    throw new Error('Please provide a host IP through the --hostip parameter or TOC_HOST_IP environment variable');
  }

  return gulp.src([
      basePaths.root + 'config.xml'
    ], {
      base: basePaths.root
    })
    .pipe(replace(
      '<content src="app/index.html"/>',
      '<content src="http://' + process.env['TOC_HOST_IP'] +
        ':8100/app/index.html" original-src="app/index.html"/>'
    ))
    .pipe(gulp.dest(basePaths.root));
});

gulp.task('uninject-livereload', function uninjectLivereload() {
  var hostIp = process.env['TOC_HOST_IP'] || argv.hostip;

  return gulp.src([
      basePaths.root + 'config.xml'
    ], {
      base: basePaths.root
    })
    .pipe(replace(
      '<content src="http://' + process.env['TOC_HOST_IP'] +
        ':8100/app/index.html" original-src="app/index.html"/>',
      '<content src="app/index.html"/>'
    ))
    .pipe(gulp.dest(basePaths.root));
});

gulp.task('inject-cordova', function injectCordova() {
  var basePath = argv.dev ? basePaths.dev : basePaths.prod;
  var baseAppPath = argv.dev ? basePaths.devApp : basePaths.prodApp;

  return gulp.src([
      baseAppPath + 'index.html'
    ], {
      base: baseAppPath
    })
    .pipe(replace(
      '</body>',
      '<script src="../cordova.js"></script></body>'
    ))
    .pipe(gulp.dest(baseAppPath))
    .pipe(gulpif(argv.dev, shell(
      'cp -r ' + basePaths.cordova + 'android/cordova.js ' + basePath + ' && ' +
      'cp -r ' + basePaths.cordova + 'android/plugins ' + basePath
    )));
});

gulp.task('uninject-cordova', function injectCordova() {
  var basePath = argv.dev ? basePaths.dev : basePaths.prod;
  var baseAppPath = argv.dev ? basePaths.devApp : basePaths.prodApp;

  return gulp.src([
      baseAppPath + 'index.html'
    ], {
      base: baseAppPath
    })
    .pipe(replace(
      '<script src="../cordova.js"></script></body>',
      '</body>'
    ))
    .pipe(gulp.dest(baseAppPath))
    .pipe(gulpif(argv.dev, shell(
      'rm -rf ' + basePath + 'cordova.js && ' +
      'rm -rf ' + basePath + 'plugins'
    )));
});

gulp.task('fix-ionic', function fixIonic() {
  //FIXME: workaround for
  // https://github.com/driftyco/ionic-cli/issues/620
  return gulp.src(basePaths.root + 'ionic.project')
    .pipe(replace(
      '"documentRoot": "toc"',
      '"documentRoot": "www"'
    ))
    .pipe(gulp.dest(basePaths.root));
});

gulp.task('unfix-ionic', function unfixIonic() {
  return gulp.src(basePaths.root + 'ionic.project')
    .pipe(replace(
      '"documentRoot": "www"',
      '"documentRoot": "toc"'
    ))
    .pipe(gulp.dest(basePaths.root));
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
    .pipe(gulpif(argv.prod, replace(' http://*:8101', '')))
    .pipe(gulpif(argv.prod, minifyHtml()))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-asset', ['build-image', 'build-font']);

gulp.task('build-font', function buildFont() {
  return gulp.src([
      basePaths.devApp + 'assets/fonts/**'
    ], {
      base: basePaths.dev
    })
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-image', function buildImage() {
  return gulp.src([
      basePaths.devApp + 'assets/images/*.svg'
      // PNGs have been pre-minified
      // basePaths.devApp + 'assets/images/**'
    ], {
      base: basePaths.dev
    })
    .pipe(gulpif(argv.prod, imagemin({
      // optimizationLevel: 7,
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
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .on('error', handleError)
    .pipe(gulpif(argv.prod, minifyCss()))
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
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
