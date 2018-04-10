(function ($) {
  'use strict'

  function submitForm () {
    var form = $(this)
    var fieldset = $(this).find('.form__fieldset')
    var result = $(this).find('.result')
    var button = $(this).find('.form__btn[type="submit"]')
    var error = false
    fieldset.find('input[required]:not([disabled]), textarea[required]:not([disabled])').each(function () {
      if ($(this).val() === '') {
        result.html('<p class="result__message result__message--yellow">Пожалуйста, заполните все необходимые поля!</p>')
        error = true
      }
    })

    var handler = '/utils/mail__' + form[0].elements['handler'] + '.php'

    if (!error) {
      var data = form.serialize()
      $.ajax({
        type: 'POST',
        url: handler,
        dataType: 'json',
        data: data,
        beforeSend: function (data) {
          button[0].disabled = true
          fieldset[0].disabled = true
        },
        success: function (data) {
          if (data['error']) {
            result.html('<p class="result__message result__message--red">Произошла ошибка на стороне сервера! Повторите попытку позже!</p><button type="button" class="result__close">&times;</button>')
            console.error('Обработчик писем вернул ошибку! Текст ошибки: ' + data['error'])
          } else {
            result.html('<p class="result__message result__message--green">Спасибо! Наш менеджер перезвонит Вам в ближайшее время!</p>')
            fieldset.trigger('reset')
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          result.html('<p class="result__message result__message--red">Произошла ошибка на стороне сервера! Повторите попытку позже!</p><button type="button" class="result__close">&times;</button>')
          result.find('.result__close').click(function () {
            $(this).parent().html('')
          })
          console.error({
            status: xhr.status,
            errorText: thrownError,
            form: form[0]
          })
        },
        complete: function (data) {
          button[0].disabled = false
          fieldset[0].disabled = false
          setTimeout(function () {
            result.html('')
          }, 10000)
        }
      })
    }
    return false
  }

  $('[data-type="mail"]').submit(submitForm)
}(window.$))
