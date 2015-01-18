var scsslint = require('./src');
var gulp = require('gulp');

var scss = 'test/fixtures/pass.scss';

gulp.task('lint', function() {
   gulp.src(scss).
      pipe(scsslint()).
      pipe(scsslint.reporter());
});

gulp.task('watch', function() {
   gulp.watch(scss, ['lint']);
});

gulp.task('default', ['lint', 'watch']);
