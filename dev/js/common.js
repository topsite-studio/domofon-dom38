(function ($, grecaptcha, alert, Tooltip, svg4everybody, objectFitImages, VP, console) {
  'use strict'

  svg4everybody()
  objectFitImages()

  $('.to-top').on('click', function (event) {
    event.preventDefault()
    var id = $(this).attr('href')
    var top = $(id).offset().top

    $('body,html').animate({scrollTop: top}, 400)
  })

  $('.js_open').on('click', function (event) {
    event.preventDefault()

    var $this = $(this)

    $this.parents('.order_content').next('.hidden_table_wrap').toggleClass('show_tr')
    /* Act on the event */
  })

  // phone mask
  $('.phone').mask('+7 (999) 999-99-99')

  // menu on hover
  var startWidth = 1440
  var menu = $('.header__list')
  var windowWidht = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth

  function removeInline () {
    if (windowWidht > startWidth) {
      menu.attr('style', '')
      $('.hamburger--collapse').removeClass('is-active')
      // $('.header__list-sublist-wrap').attr("style", "");
      // $('.hamburger--collapse').removeClass('is-active');
    };
  };
  // removeInline();

  // open menu
  $('#openup').on('click', function (e) {
    e.preventDefault()
    // $('.header__list-open-submenu').removeClass('header__list-open-submenu--open');
    $('.hamburger--collapse').stop(true, true).toggleClass('is-active')
    // $('.header__list-sublist-wrap').attr("style", "");
    menu.stop(true, true).slideToggle()
    menuOn()
  })

  function menuOn () {
    // activate the menu only if the width of the window is less than the specified
    windowWidht = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (windowWidht <= startWidth) {
      // hide the menu when clicking on the first and second level link
      $('.header__list-link').on('click', function (event) {
        // $('.header__list-sublist-wrap').css('display', 'none');
        // $('.header__list-open-submenu').removeClass('header__list-open-submenu--open');
        menu.stop(true, true).slideToggle()
        $('.hamburger--collapse').stop(true, true).toggleClass('is-active')
      })

      // close menu if click on "body"
      $(document).mouseup(function (e) {
        if (menu.is(':visible') && $(e.target).closest('.header__nav-wrap').length === 0) {
          menu.attr('style', '')
          $('.hamburger--collapse').removeClass('is-active')
        }
      })
    };
  };

  /* menuON */
  menuOn()

  $(window).resize(function () {
    windowWidht = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    removeInline()
  })
  // menu on hover end
}(window.$, window.grecaptcha, window.alert, window.Tooltip, window.svg4everybody, window.objectFitImages, window.VP, window.console))
