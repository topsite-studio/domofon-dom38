(function ($, $html) {
  'use strict'

  var button = document.querySelector('.to-top')
  var pinnedToViewport = true
  button.style.display = 'none'

  $(button).on('click', function (event) {
    event.preventDefault()
    var id = $(this).attr('href')
    var top = $(id).offset().top

    $('body,html').animate({ scrollTop: top }, 400)
  })

  $(window).scroll(function () {
    var offset = {
      viewport: $html.scrollTop + $html.clientHeight - button.clientHeight - 20,
      footer: $('.foot').offset().top - button.clientHeight - 20,
      'Кнопка закреплена': pinnedToViewport
    }

    //console.log(offset)

    if ($html.scrollTop > $html.clientWidth) {
      $(button).fadeIn('500')
    } else {
      $(button).fadeOut('500')
    }

    if (offset.viewport >= offset.footer) {
      if (pinnedToViewport) {
        button.style.position = !button.style.position ? 'absolute' : button.style.position
        button.style.top = !button.style.top ? '-70px' : button.style.top
        button.style.bottom = !button.style.bottom ? 'auto' : button.style.bottom
        pinnedToViewport = false
      }
    } else {
      if (!pinnedToViewport) {
        button.style.position = ''
        button.style.top = ''
        button.style.bottom = ''
        pinnedToViewport = true
      }
    }
  })
}(window.$, document.documentElement))
