var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', function() {
    gulp.src('src/multi.js')
    .pipe(gulp.dest('product'));
    
    gulp.src('src/multi.js')
    .pipe(uglify())
    .pipe(rename('multi.min.js'))
    .pipe(gulp.dest('product'));
});
