module.exports = function() {
  var jsLibsPath = [ 
    // jqurye 3...
    //'node_modules/jquery/dist/jquery.js', 
    //jquery 2.2.4
    // 'dev/libs/jquery/jquery-2.2.4.min.js',

    // svg4everybody
    'node_modules/svg4everybody/dist/svg4everybody.min.js',

    //magnific-popup
    //http://dimsemenov.com/plugins/magnific-popup/
    // 'dev/libs/magnific-popup/dist/jquery.magnific-popup.js',
    //'node_modules/magnific-popup/dist/jquery.magnific-popup.js', 

    //zoom
    //'dev/libs/zoom-master/jquery.zoom.js',

    //flip countdown
    //'dev/libs/FlipClock-master/compiled/flipclock.min.js',

    //jquery.countdown
    //'dev/libs/jquery.countdown-2.1.0/jquery.countdown.min.js', // библиотека для таймера

    //owl.carousel_2
    //https://owlcarousel2.github.io/OwlCarousel2/
    //'dev/libs/owl.carousel_2/owl.carousel.js',

    //slick-carousel
    //http://kenwheeler.github.io/slick/
    // 'dev/libs/slick-carousel/slick/slick.js',
    // 'node_modules/slick-carousel/slick/slick.js',

    //bxSlider
    //'dev/libs/jquery.bxslider/jquery.bxslider.min.js',

    //animate css file
    //'dev/libs/animate.css/waypoints.js',
    //'dev/libs/animate.css/animate.js',

    //form validation file
    // 'dev/libs/jquery.validate/jquery.validate.js',
    // 'dev/libs/jquery.validate/messages_ru.js',

    //phone mask file
    'dev/libs/phone.mask/mask.js',

    //jQuery.dotdotdot-master
    //'dev/libs/jQuery.dotdotdot-master/dist/jquery.dotdotdot.js',

    //jQueryFormStyler
    //http://dimox.name/jquery-form-styler/
    //'node_modules/jquery-form-styler/dist/jquery.formstyler.js',

    //jQuery-One-Page-Nav-master
    //https://github.com/davist11/jQuery-One-Page-Nav
    //'dev/libs/jQuery-One-Page-Nav-master/jquery.nav.js',

    //mmenu
    //'dev/libs/mmenu/jquery.mmenu.all.js',

    //jquery-cookie
    //'dev/libs/jquery-cookie-master/src/jquery.cookie.js',

    //jquery.steps
    //'dev/libs/jquery.steps/build/jquery.steps.js',

    //retina.js
    //https://github.com/strues/retinajs
    /* usage
    @2x.png,@3x.png
    in HTML
      img(src="img/content/img_name.png", alt="image", data-rjs="3")
    in SASS
      +retina("img/general/img_name.png", 3, cover, center top no-repeat)
      */

    // 'dev/libs/retina/retina.js',

    //instagram photo

    /* how to use
    $(".inst_block").instagramGet({
      "user_id": "1318009955",
      "access_token": "1318009955.1677ed0.464f56fb2cd543e0b698f2603d05363d",
      "count": 9,
    });
    */

    //'dev/libs/insta_photo/inst.js',

    // 'dev/libs/popper.js/dist/popper.min.js',

    //object fit polyfill
    //https://github.com/bfred-it/object-fit-images

    /* how to use
    in common.js add 
      objectFitImages();
    in style use sass mixin:
      +object-fit(contain)
    or object-fit and object-position:
      +object-fit(cover, top)
      */

    'node_modules/object-fit-images/dist/ofi.js',

    //moment
    //'dev/libs/moment/moment.js',
    //'dev/libs/moment/moment-timezone-with-data.js',

  ];


  $.gulp.task('js:dev', () => {
    return $.gulp.src('dev/js/*.js')
      .pipe($.gp.sourcemaps.init())
      .pipe($.gp.uglify({
      mangle: false,
      compress: {
        sequences: false, //join consecutive simple statements using the comma operator
        dead_code: true,
        conditionals: true,// optimize if else
        booleans: true,
          drop_console: false
      },
      output: {
        beautify: true
      }
    }))
      .on("error", $.gp.notify.onError({
      title: "Error in JS:",
      message: "\n Error in: <%= error.cause.filename %>\n Error text: <%= error.cause.message %> \n Error in line: <%= error.cause.line %>",
    }))
      .pipe($.gp.sourcemaps.write())
      .pipe($.gulp.dest('build/js/'))
      .pipe($.browserSync.reload({
      stream: true
    }))
  });

  $.gulp.task('js:build', () => {
    return $.gulp.src('dev/js/*.js')
      .pipe($.gp.removeCode({ production: true }))
      .pipe($.gp.uglify({
      mangle: false,
      compress: {
        sequences: false, //join consecutive simple statements using the comma operator
        dead_code: true,
        conditionals: true,// optimize if else
        booleans: true,
        join_vars: true,//join consecutive var statements
        drop_console: true
      },
      output: {
        beautify: true
      }
    }))
      .on("error", $.gp.notify.onError({
      title: "Error in JS:",
      message: "\n Error in: <%= error.cause.filename %>\n Error text: <%= error.cause.message %> \n Error in line: <%= error.cause.line %>",
    }))
      .pipe($.gulp.dest('build/js/'))
  });

  $.gulp.task('libsJS:dev', () => {
    return $.gulp.src(jsLibsPath)
    //      .pipe($.gp.concat('libs.min.js'))
      .pipe($.gp.uglify({
      mangle: false,
      // output: {
      //  beautify: true
      // }
    }))
      .on("error", $.gp.notify.onError({
      title: "Error in JS:",
      message: "\n Error in: <%= error.cause.filename %>\n Error text: <%= error.cause.message %> \n Error in line: <%= error.cause.line %>",
    }))
      .pipe($.gulp.dest('build/js/'))
  });

  $.gulp.task('libsJS:build', () => {
    return $.gulp.src(jsLibsPath)
    //      .pipe($.gp.concat('libs.min.js'))
      .pipe($.gp.uglify({
      mangle: false,
      // output: {
      //   beautify: true
      // }
    }))
      .on("error", $.gp.notify.onError({
      title: "Error in JS:",
      message: "\n Error in: <%= error.cause.filename %>\n Error text: <%= error.cause.message %> \n Error in line: <%= error.cause.line %>",
    }))
      .pipe($.gulp.dest('build/js/'))
  });

};

