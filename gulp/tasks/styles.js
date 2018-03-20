module.exports = function () {

  $.gulp.task('sass:dev', () => {
    return $.gulp.src('dev/sass/main.sass')
    .pipe($.gp.sourcemaps.init())
    .pipe($.gp.sass())
    .on('error', $.gp.notify.onError(function (error) {
      return {
        title: 'sass',
        message: error.message 
      };
    }))
//    .pipe($.gp.autoprefixer({
//    browsers: ['last 6 version']
//    }))
    .pipe($.gcmq())
    //.pipe($.gp.cssnano()) 
    //.pipe($.gp.cleanCss())
    .pipe($.gp.csso({
      // forceMediaMerge: true
    })) 
    .on('error', $.gp.notify.onError(function (error) {
      return {
        title: 'sass',
        message: error.message 
      };
    }))
    .pipe($.gp.sourcemaps.write())
    .pipe($.gulp.dest('build/css/'))
    .pipe($.browserSync.reload({
      stream: true
    }))
  });

  $.gulp.task('sass:build', () => {
    return $.gulp.src('dev/sass/main.sass ')
    .pipe($.gp.sass())
    .pipe($.gp.autoprefixer({
      browsers: ['last 3 version']
    }))
    .pipe($.gcmq())
    //.pipe($.gp.cssnano()) 
    //.pipe($.gp.cleanCss({
    //format: 'beautify' 
    //}))
    .pipe($.gp.csso())
    .pipe($.gulp.dest('build/css/'))
  }); 

  $.gulp.task('sassLibs:dev', () => {
    return $.gulp.src('dev/sass/libs.sass')
    .pipe($.gp.sourcemaps.init())
    .pipe($.gp.sass())
    .on('error', $.gp.notify.onError(function (error) {
      return {
        title: 'sass',
        message: error.message
      };
    }))
    .pipe($.gcmq())
    //.pipe($.gp.autoprefixer({
    //browsers: ['last 3 version']
    //}))
    //.pipe($.gp.cssnano()) 
    //.pipe($.gp.cleanCss())
    .pipe($.gp.csso()) 
    .pipe($.gp.sourcemaps.write())
    .pipe($.gulp.dest('build/css/'))
    .pipe($.browserSync.reload({
      stream: true
    }));
  });


  $.gulp.task('sassLibs:build', () => {
    return $.gulp.src('dev/sass/libs.sass ')
    .pipe($.gp.sass())
    .pipe($.gp.autoprefixer({
      browsers: ['last 3 version']
    }))
    .pipe($.gcmq())
    //.pipe($.gp.cssnano()) 
    //.pipe($.gp.cleanCss())
    .pipe($.gp.csso())
    .pipe($.gulp.dest('build/css/'))
  });

};