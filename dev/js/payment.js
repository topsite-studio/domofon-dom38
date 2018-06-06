(function ($, VP) {
  'use strict'

  /**
   * Изображение стрелки внутри кнопки
   * @type {Image}
   */
  var arrowImage = new Image()
  arrowImage.src = '/img/svg/refresh-white.svg'
  arrowImage.className = 'btn__icon btn__icon--loading'
  var url_string = window.location.href;
/*  var url = new URL(url_string);
  var hash = url.searchParams.get('hash');
  var number = url.searchParams.get('number');*/
  /**
  * Функция для отправки POST-запрос к API домофона
  */
  function ieWorstThing(str1, str2)
  {
    tmp=substr(str1.indexOf(str2),str1.length).indexOf('&');
    if(tmp!=-1){}

  }
  function ieWorstestThing(str1,str2, int)
  {
    return str1.substr(str1.indexOf(str2)+ str2.length + 1, str1.indexOf(str2) + str2.length + int)
  }
   /*$('document').ready( function() {
    if(hash!=null&&number!=null)
    {
      $.ajax({
      type: 'POST',
      url: 'https://domofon.dom38.ru/api/contracts/find-for-pay/',
      data: {
        "number" : number,
        "hash" : hash,
        "response" : ''
      },
      dataType: 'json',
      success: function (data, textStatus) {
        if (textStatus === 'success') {
          showContractInfo(data);
        } else {
          console.log('error!');
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        showContractInfo(data);
        window.alert('Произошла ошибка сервера! Номер ошибки: ' + xhr.status)
      }
    })
    }
  });*/

  var number=ieWorstestThing(url_string, 'hash', 0)
  console.log(number)
  function contractLogin (event) {
    event.preventDefault()
    var form = $(this)[0]
    var submitButton = form.elements.submit


    $.ajax({
      type: 'POST',
      url: 'https://domofon.dom38.ru/api/contracts/find-for-pay/',
      data: {
        'response': form.elements['g-recaptcha-response'].value,
        'number': form.elements.contract.value
      },
      dataType: 'json',
      beforeSend: function () {
        // В кнопке меняем текст на анимированную иконку
        submitButton.innerHTML = arrowImage.outerHTML
        submitButton.style.pointerEvents = 'none'
      },
      success: function (data, textStatus) {
        if (textStatus === 'success') {
          showContractInfo(data)
        } else {
          console.error('error!')
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        window.alert('Произошла ошибка сервера! Номер ошибки: ' + xhr.status)
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
    contract.login.hidden=true

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
        '&amount=500' +
        '&service=1' +
        '&utm_source=widget' +
        '&utm_medium=' + (($scope.company.guid || 'scel')) + '_full' +
        '&utm_campaign=domofon.dom38.ru'
    })
  }

  if ($('[data-form=payment]')[0]) {
    $('[data-form=payment]').submit(contractLogin)
  }
}(window.$, window.VP))
