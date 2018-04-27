module.exports = function() {
    $.gulp.task('copy', () => {
        return $.gulp.src(['dev/root_file/**/*.*', 'dev/root_file/.htaccess'])
            .pipe($.gulp.dest('build/'));
    });
};
