
(function ($, $html) {
  'use strict'

  var animationSpeed = 750

  if (window.hashName) {
    window.addEventListener('load', function (event) {
      event.preventDefault()
      scrollTo(window.hashName)
    })
  }

  $('[data-anchor]').click(function (e) {
    e.preventDefault()

    var source = $(this)[0]
    var initialWindowOffset = $html.scrollTop
    scrollTo($(this).attr('href'))

    if (window.matchMedia('(max-width: 767px)').matches) {
      setTimeout(function () {
        var backButton = document.createElement('span')
        backButton.setAttribute('role', 'button')
        backButton.className = 'back-button'
        backButton.innerText = 'Вернуться'
        backButton.style.position = 'fixed'
        backButton.style.display = 'none'
        backButton.addEventListener('click', function (event) {
          scrollTo(initialWindowOffset)
          source.style.backgroundColor = '#3292d2'
          source.style.color = '#fff'
          $(this).fadeOut(animationSpeed, function () {
            $(this)[0].remove()
          })
          setTimeout(function () {
            source.style.backgroundColor = ''
            source.style.color = ''
          }, 2000)
        })
        document.body.appendChild(backButton)
        $(backButton).fadeIn(animationSpeed)
      }, 500)
    }
  })

  function scrollTo (selector) {
    var destination
    var offsetTop = (window.matchMedia('(min-width: 641px)').matches) ? $html.clientHeight / 4 : 50
    if (typeof selector === 'number') {
      destination = selector
    } else {
      var target = $(selector)
      destination = target.offset().top - offsetTop
    }
    $('html,body').animate({ scrollTop: destination }, animationSpeed)
    return false
  }
}(window.$, document.documentElement))
