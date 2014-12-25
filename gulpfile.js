var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var traceur = require('gulp-traceur');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  sass: [
    './www/components/**/*.scss',
    './www/sections/**/*.scss',
    './www/app.scss',
    '!./www/app.min.css'
  ],
  js: [
    './www/**/*.js',
    '!./www/app.es6.js'
  ]
};

gulp.task('default', ['sass']);



gulp.task('sass', function(done) {
  gulp.src('./www/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('js', function() {
  //gulp.src('./www/app.js')
  //  .pipe(sourcemaps.init())
  //  .pipe(traceur())
  //  .pipe(concat('app.es6.js'))
  //  .pipe(sourcemaps.write())
  //  .pipe(gulp.dest('./www/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
});