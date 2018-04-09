(function ($) {
  'use strict'

  $('[data-anchor]').click(function (e) {
    e.preventDefault()
    var target = $($(this).attr('href'))
    var animationSpeed = 750
    var offsetTop = document.documentElement.clientHeight / 4
    var destination = target.offset().top - offsetTop

    $('html,body').animate({ scrollTop: destination }, animationSpeed)

    return false
  })
}(window.$))
