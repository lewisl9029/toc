/* jshint node: true */
var gulp = require('gulp');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
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

var basePaths = {
  dev: './toc/',
  app: './toc/app/',
  prod: './www/',
  prodApp: './www/app/',
  mobile: './mobile/',
  platforms: './platforms/'
};

var paths = {
  sass: [
    basePaths.app + 'components/**/*.scss',
    basePaths.app + 'libraries/**/*.scss',
    basePaths.app + 'views/**/*.scss',
    basePaths.app + '*.scss',
    basePaths.dev + 'landing.scss'
  ],
  js: [
    basePaths.app + 'components/**/*.js',
    basePaths.app + 'libraries/**/*.js',
    basePaths.app + 'services/**/*.js',
    basePaths.app + 'views/**/*.js',
    basePaths.app + '*.js',
    basePaths.dev + '*.js',
    './*.js'
  ],
  html: [
    basePaths.app + 'components/**/*.html',
    basePaths.app + 'views/**/*.html',
    basePaths.app + '*.html',
    basePaths.dev + '*.html'
  ],
  asset: [
    basePaths.app + 'assets/**'
  ]
};

gulp.task('watch', function watch() {
  gulp.watch(paths.sass, ['bundle-sass']);
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
    ['build-js', 'build-html', 'build-sass', 'build-asset'],
    'inject-js',
    'cache-jspm',
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

gulp.task('run', function run() {
  return gulp.src('')
    .pipe(shell(
      'ionic run --device --livereload --livereload-port 8101 ' +
      '--external-address $TOC_HOST_IP android'
    ));
});

gulp.task('build-js', ['build-jspm'], function buildJs() {
  return gulp.src([
      basePaths.app + 'dependencies/system.src.js',
      basePaths.app + 'jspm-config.js',
      basePaths.app + 'initialize.js',
      basePaths.dev + 'landing.js',
    ], {
      base: basePaths.dev
    })
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('inject-js', function injectJs() {
  return gulp.src([
      basePaths.prodApp + 'initialize.js',
    ], {
      base: basePaths.prodApp
    })
    .pipe(gulpif(argv.prod, header('window.tocProd=true;')))
    .pipe(gulp.dest(basePaths.prodApp));
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

gulp.task('build-html', function buildHtml() {
  return gulp.src([
      basePaths.app + 'index.html',
      basePaths.dev + 'index.html',
    ], {
      base: basePaths.dev
    })
    .pipe(gulpif(argv.prod, minifyHtml()))
    .pipe(gulp.dest(basePaths.prod));
});

gulp.task('build-asset', function buildAsset() {
  return gulp.src([
      basePaths.app + 'assets/**'
    ], {
      base: basePaths.dev
    })
    .pipe(gulp.dest(basePaths.prod));
});

//not part of build because this only needs to run occassionaly for new images
gulp.task('build-image', function buildImage() {
  return gulp.src([
      basePaths.app + 'assets/images/**'
    ], {
      base: basePaths.dev
    })
    .pipe(imagemin({
      optimizationLevel: 7,
      multipass: true
    }))
    .pipe(gulp.dest(basePaths.dev));
});

gulp.task('build-sass', ['bundle-sass'], function buildSass() {
  return gulp.src([
      basePaths.app + 'app.css',
      basePaths.app + 'initialize.css',
      basePaths.dev + 'landing.css'
    ], {
      base: basePaths.dev
    })
    .pipe(gulp.dest(basePaths.prod))
    .on('error', handleError);
});

gulp.task('bundle-sass', function bundleSass() {
  return gulp.src([
      basePaths.app + 'app.scss',
      basePaths.app + 'initialize.scss',
      basePaths.dev + 'landing.scss'
    ], {
      base: basePaths.dev
    })
    .pipe(gulpif(!argv.prod, sourcemaps.init()))
    .pipe(sass())
    .on('error', handleError)
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
    .pipe(gulpif(argv.prod, minifyCss()))
    .pipe(gulp.dest(basePaths.dev))
    .on('error', handleError);
});
