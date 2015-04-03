var gulp = require('gulp');
var react = require('gulp-react');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
    return gulp.src('public/js/*.jsx')
        .pipe(react())
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});
