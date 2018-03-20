module.exports = function () {

  $.gulp.task('sprite:dev', (spriteDone) => {
    var spriteData =  $.gulp.src('dev/img/ico/**/*.{png,jpg,gif}')
    .pipe($.gp.spritesmith({

//      retinaSrcFilter: 'dev/img/ico/**/*@2x.{png,jpg,gif}',
//      retinaImgName: 'sprite@2x.png',
//      retinaimgPath: '../img/general/sprite@2x.png',

      imgName: 'sprite.png',
      cssName: 'sprite.sass',
      //cssFormat: 'sass', //необходиом закоментировать при использовании ретина спрайтов
      padding: 5,
      imgPath: '../img/general/sprite.png',
    }));
    var imgStream = spriteData.img.pipe($.gulp.dest('dev/img/general'));
    var cssStream = spriteData.css.pipe($.gulp.dest('dev/sass/'));
    spriteDone();
  });

};
