(function ($, grecaptcha, alert, Tooltip, svg4everybody, objectFitImages, VP, console) {
  'use strict'

  svg4everybody()
  objectFitImages()

  $('.accordion__title').click(function () {
    var $this = $(this)

    $this.next('.accordion__content').stop(true, true).slideToggle('200')
    $this.parent().toggleClass('accordion__item--active')

    $this.parent().siblings('.accordion__item').children('.accordion__content').stop(true, true).slideUp('200')
    $this.parent().siblings('.accordion__item').removeClass('accordion__item--active')
  })

  var toolTips = $('.tooltips')
  toolTips.each(function (index, el) {
    var toolData = $(this).data('tooltips')
    new Tooltip(el, {
      title: toolData,
      placement: 'top',
      html: true
    })
  })

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

  /**
  * Функция для отправки POST-запрос к API домофона
  */
  function contractLogin (event) {
    event.preventDefault()
    var form = $(this)[0]

    $.ajax({
      type: 'POST',
      url: 'https://domofon.dom38.ru/api/contracts/find-for-pay/',
      data: {
        'response': form.elements['g-recaptcha-response'].value,
        'number': form.elements.contract.value
      },
      dataType: 'json',
      success: function (data, textStatus) {
        console.info(data)
        alert(textStatus)
        if (textStatus === 'success') {
          showContractInfo(data)
        } else {
          alert('error!')
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        alert('Результат: ошибка! Номер ошибки: ' + xhr.status)
        console.error({
          xhr: xhr,
          ajax: ajaxOptions,
          error: thrownError
        })
      }
    })
    // var contractData = $.getJSON('//domofon.dom38.ru/api/contracts/find-for-pay', {
    //   response: form.elements['g-recaptcha-response'].value,
    //   number: form.elements.contract.value
    // })
    // console.log(contractData)
    return false
  }

  /**
  * Функция для показа данных по договору
  * @param {object} result Данные по договору в json-формате, полученные через API domofon.dom38.ru
  */
  function showContractInfo (result) {
    // Упорядочиваем все данные
    var scope = {
      contract: result.contract,
      services: {
        total: 0,
        items: result.services
      }
    }

    // Обьявляем переменные всех объектов, куда будем выводить данные
    var contract = {
      login: document.querySelector('#contract-input'),
      info: document.querySelector('#contract-info'),
      num: document.querySelector('#contract-number'),
      address: document.querySelector('#address'),
      services: document.querySelector('#contract-services'),
      resultValue: document.querySelector('#result-value'),
      payButton: document.querySelector('#pay-button')
    }

    // Удаляем форму ввода номера договора
    contract.login.remove()

    // Выводим все данные в блок показа данных (пока только сам номер договора)
    contract.num.innerText = scope.contract.number
    contract.address.innerHTML = scope.contract.address + ', кв. ' + scope.contract.flat

    for (var i = 0; i < scope.services.items.length; i++) {
      var service = scope.services.items[i]
      var draftItem = document.createElement('li')
      draftItem.className = 'draft__item'
      draftItem.innerText = service.name + ': ' + service.amount + ' руб.'
      contract.services.appendChild(draftItem)
      scope.services.total += service.amount
    }

    contract.resultValue.innerText = scope.services.total

    // Показываем блок показа данных
    contract.info.hidden = false

    contract.payButton.addEventListener('click', function () {
      openPaymentModal(result)
    })
  }

  /**
  * Функция открытия модалки с модулем оплаты
  * @param {object} result Данные по договору в json-формате, полученные через API domofon.dom38.ru
  */
  function openPaymentModal (data) {
    // var $scope = ,data
    var $scope = {
      total: 0,
      contract: data.contract,
      company: data.company,
      services: data.services.filter(function (service) {
        return !service.includable
      })
    }
    $scope.services.forEach(function (service) {
      $scope.total += service.amount
    })

    VP.widget.modal({
      url: '//vp.ru/common-modal/' +
        '?action=provider' +
        '&guid=' + ($scope.company.guid || 'scel') +
        '&acc=' + $scope.contract.number +
        '&amount=' + $scope.total +
        '&service=1' +
        '&utm_source=widget' +
        '&utm_medium=' + (($scope.company.guid || 'scel')) + '_full' +
        '&utm_campaign=domofon.dom38.ru'
    })
  }

  if ($('[data-form=payment]')[0]) {
    $('[data-form=payment]').submit(contractLogin)
  }

  function keystoresMap () {
    var myMap
    var ymaps = window.ymaps

    var $scope = {
      me: {
        lat: 52.259991556571,
        lon: 104.28508262634,
        hint: 'Я тут!',
        icon: 'assets/images/me.png',
        draggable: true,
        boundedZoom: false
      }
    }
    ymaps.ready(function () {
      var geolocation = ymaps.geolocation

      // TODO: Настроить объединение всех пунктов продаж в кластеры
      myMap = new ymaps.Map('keystores-map', {
        center: [geolocation.lat, geolocation.lon],
        zoom: 17
      })

      var myLocation = new ymaps.Placemark([56.342436, 43.941972])
      myMap.geoObjects.add(myLocation)

      geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
      }).then(function (result) {
        result.geoObjects.options.set('preset', 'islands#redCircleIcon')
        result.geoObjects.get(0).properties.set({
          balloonContentBody: 'Мое местоположение'
        })
        myMap.geoObjects.add(result.geoObjects)
      })

      geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
      }).then(function (result) {
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon')
        myMap.geoObjects.add(result.geoObjects)
      })

      reorderFeeStations(myMap)
    })
  }

  function reorderFeeStations (map) {
    /*
      Пример объекта:
      __v: 0
      _id: "5788577c11d5f1d615db4c58"
      address: "г Иркутск, ул Рабочего Штаба, д. 9"
      comment: "Пункт оплаты не найден на сайте"
      coords: Object { lat: 52.301544, lon: 104.297089 }
      id: "5788577c11d5f1d615db4c58"
      lat: 52.301544
      lon: 104.297089
      name: "ПОДРАЗДЕЛЕНИЕ БАНКА"
      params: Object { jtype: "OibItt", id: 952156, code: "952156", … }
      published: false
      type: "sberbank"
    */
    var stations = {
      sberbank: null,
      gorod: null
    }
    $.getJSON('https://domofon.dom38.ru/api/fee-stations/sberbank', function (data) {
      stations.sberbank = data
      showStations(stations.sberbank)
    })
    $.getJSON('https://domofon.dom38.ru/api/fee-stations/uplati', function (data) {
      stations.gorod = data
      showStations(stations.gorod)
    })

    function showStations (list) {
      for (var i = 0; i < list.length; i++) {
        var item = list[i]
        if (item.published) {
          var placemark = new ymaps.Placemark([item.lat, item.lon], {
            balloonContentHeader: item.name,
            balloonContentBody: '<address><p>' + item.address + '</p></address>',
            balloonContentFooter: '<em>' + item.lat + ', ' + item.lon + '</em>',
            closeButton: false
          })
          map.geoObjects.add(placemark)
        }
      }
    }
  }

  var keystoresMapObject = document.querySelector('#keystores-map')

  if (keystoresMapObject) {
    console.log('Запускаем карту работяги')
    document.addEventListener('DOMContentLoaded', keystoresMap)
  }

  if (document.querySelector('.page--keystores')) {

  }
}(window.$, window.grecaptcha, window.alert, window.Tooltip, window.svg4everybody, window.objectFitImages, window.VP, window.console))
