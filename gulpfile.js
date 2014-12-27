var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

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
    .pipe(sass())
    .pipe(gulp.dest('./www/'))
    //.pipe(minifyCss({
    //  keepSpecialComments: 0
    //}))
    //.pipe(rename({ extname: '.min.css' }))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});