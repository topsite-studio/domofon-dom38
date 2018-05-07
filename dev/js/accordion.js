(function(w, d, $) {
  'use strict'

  $('.accordion__title').click(function (e) {
    var $this = $(this)

    $this.next('.accordion__content').stop(true, true).slideToggle('200')
    $this.parent().toggleClass('accordion__item--active')

    $this.parent().siblings('.accordion__item').children('.accordion__content').stop(true, true).slideUp('200')
    $this.parent().siblings('.accordion__item').removeClass('accordion__item--active')

    if (w.matchMedia('(max-width: 991px)').matches) {
      var animationSpeed = 750
      var anchorOffset = d.documentElement.clientHeight / 5
      var destination = $this.offset().top - anchorOffset
      $('html, body').animate({ scrollTop: destination }, animationSpeed)
    }
    e.preventDefault()
    return false
  })
})(window, document, window.$);
