var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

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