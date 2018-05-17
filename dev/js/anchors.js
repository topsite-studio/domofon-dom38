(function ($, $html) {
  'use strict'

  $('[data-anchor]').click(function (e) {
    e.preventDefault()

    var source = $(this)[0]
    var initialWindowOffset = $html.scrollTop

    console.log({
      'Исходная точка': source,
      'initialWindowOffset': initialWindowOffset
    })

    var target = $($(this).attr('href'))
    var animationSpeed = 750
    var offsetTop = (window.matchMedia('(min-width: 641px)').matches) ? $html.clientHeight / 4 : 50
    var destination = target.offset().top - offsetTop

    $('html,body').animate({ scrollTop: destination }, animationSpeed)

    if (window.matchMedia('(max-width: 767px)').matches) {
      setTimeout(function () {
        var backButton = document.createElement('span')
        backButton.setAttribute('role', 'button')
        backButton.className = 'back-button'
        backButton.innerText = 'Вернуться'
        backButton.style.position = 'fixed'
        backButton.style.display = 'none'
        backButton.addEventListener('click', function (event) {
          $('html,body').animate({ scrollTop: initialWindowOffset }, animationSpeed)
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

    return false
  })
}(window.$, document.documentElement))
