(function(w, d, $) {
  'use strict'

  $('.accordion__title').click(function () {
    var $this = $(this)

    $this.next('.accordion__content').stop(true, true).slideToggle('200')
    $this.parent().toggleClass('accordion__item--active')

    $this.parent().siblings('.accordion__item').children('.accordion__content').stop(true, true).slideUp('200')
    $this.parent().siblings('.accordion__item').removeClass('accordion__item--active')
  })
})(window, document, window.$);
