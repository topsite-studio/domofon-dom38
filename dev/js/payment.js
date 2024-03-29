(function ($, VP) {
  'use strict'

  /**
   * Изображение стрелки внутри кнопки
   * @type {Image}
   */
  var arrowImage = new Image()
  arrowImage.src = '/img/svg/refresh-white.svg'
  arrowImage.className = 'btn__icon btn__icon--loading'

  /**
   * Парсинг строки,
   * поиск содержания переменной в адресной строке. IE не поддерживает встроенную функцию
   */
  function varParser(str, name) {
    function findingAmp(s) {
      return s.indexOf('&')===-1 ? s.length : s.indexOf('&');
    }
    if ( str.indexOf(name) !== -1 ) {
      return str.substr(str.indexOf(name)+name.length+1,findingAmp(str.substr(str.indexOf(name)+name.length+1, str.length)))
    } else {
      return null
    }
  }
  /**
  * Автоматический сабмит по гет-запросу
  */
  var url_string = window.location.href;
  var hashInUrl = varParser(url_string, 'hash');
  var contractNumber = varParser(url_string, 'number');
  $('document').ready( function() {
    if ( hashInUrl !== null && contractNumber !== null ) {
      $.ajax({
        type: 'POST',
        url: 'https://domofon.dom38.ru/api/contracts/find-for-pay/',
        data: {
          "number" : contractNumber,
          "hash" : hashInUrl,
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
          showContractInfo(data)
          window.alert('Произошла ошибка сервера! Номер ошибки: ' + xhr.status)
        }
      })
    }
  });

  /**
  * Функция для отправки POST-запрос к API домофона
  */
  function contractLogin (event) {
    event && event.preventDefault()
    var form = $(this)[0]
    var submitButton = document.getElementById('check-contract')

    $.ajax({
      type: 'POST',
      url: 'https://domofon.dom38.ru/api/contracts/find-for-pay/',
      data: {
        'response': grecaptcha.getResponse(),
        'number': form.elements.contract.value,
        'invisible': true
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
        window.alert('Произошла ошибка сервера! Неверный номер договора! Номер ошибки: ' + xhr.status)
        submitButton.innerHTML = 'Вход';
        submitButton.style.pointerEvents = 'auto';
        grecaptcha.reset();
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
        total: 500,//0
        items: result.services
      },
      balance: result.contract.balance,
      id: result.contract.deviceId
    }
    // Обьявляем переменные всех объектов, куда будем выводить данные
    var contract = {
      login: document.querySelector('#contract-input'),
      info: document.querySelector('#contract-info'),
      num: document.querySelector('#contract-number'),
      address: document.querySelector('#address'),
      services: document.querySelector('#contract-services'),
      resultValue: document.querySelector('#result-value'),
      payButton: document.querySelector('#pay-button'),
      formFooter: document.querySelector('.draft__footer')
    }

    // Удаляем форму ввода номера договора
    contract.login.hidden=true
    $('#check-contract').css("display", "none")

    // Выводим все данные в блок показа данных (пока только сам номер договора)
    contract.num.innerText = scope.contract.number
    contract.address.innerHTML = scope.contract.address + ', кв. ' + scope.contract.flat

    /*for (var i = 0; i < scope.services.items.length; i++) {
      var service = scope.services.items[i]
      var draftItem = document.createElement('li')
      draftItem.className = 'draft__item'
      draftItem.innerText = service.name + ': ' + service.amount + ' руб.'
      contract.services.appendChild(draftItem)
      scope.services.total += service.amount
    }*/
    if (scope.id) {
      if(scope.balance < 0) {
        scope.services.total -= scope.balance;
        var draftItem = document.createElement('li')
        draftItem.className = 'draft__item'
        draftItem.innerText = '1. Задолженность: ' + scope.balance + ' руб.'
        contract.services.appendChild(draftItem)
        var draftItem = document.createElement('li')
        draftItem.className = 'draft__item'
        draftItem.innerText = '2. Рекомендованный аванс: 500 руб.'
        contract.services.appendChild(draftItem)
      } else {
        var draftItem = document.createElement('li')
        draftItem.className = 'draft__item'
        draftItem.innerText = 'Рекомендованный аванс: 500 руб.'
        contract.services.appendChild(draftItem)
      }
      contract.resultValue.value = scope.services.total
      // Показываем блок показа данных
      contract.info.hidden = false
      contract.payButton.addEventListener('click', function () {
        openPaymentModal(result)
      })
    } else {
      contract.address.innerHTML = 'Активируйте КАРТУ-КЛЮЧ НОВОСЕЛА! Для этого войдите с помощью неё в подъезд'
      contract.address.style.color = 'red'
      contract.formFooter.hidden = true
      contract.payButton.hidden = true
      contract.info.hidden = false
    }
  }

  /**
  * Функция открытия модалки с модулем оплаты
  * @param {object} result Данные по договору в json-формате, полученные через API domofon.dom38.ru
  */
  function openPaymentModal (data) {
    // var $scope = ,data
    var $scope = {
      total: document.querySelector('#result-value').value,
      contract: data.contract,
      company: data.company,
      services: data.services.filter(function (service) {
        return !service.includable
      })
    }
    /*$scope.services.forEach(function (service) {
      $scope.total += service.amount
    })*/
    /**
    *Если пользователь - яблочник, то костыль, иначе - модалка
    */
    if(window.navigator.vendor.indexOf('Apple')>-1) {
      var form = $('<form>', {name: "form", method: "POST", action: "https://vp.ru/common-modal/", target: "_blank"});
      var div1 = $('<div/>', {class: "hidden", id: "safari-1"});
      var input1 = $('<input>', {type: "text", name: "guid", value: ($scope.company.guid || 'scel')});
      var input2 = $('<input>', {type: "text", name: "action", value: 'provider'});
      var input3 = $('<input>', {type: "text", name: "service", value: '1'});
      var input4 = $('<input>', {type: "text", name: "acc", value: $scope.contract.number});
      var input5 = $('<input>', {type: "text", name: "amount", value: $scope.total});
      var input6 = $('<input>', {type: "number", autocomplete: "off", value: ''});
      var input7 = $('<input>', {type: "submit", value: "Оплатить", id: "mySub"});

      $("#app").append(form);
      $("[name=form]").append(div1);
      $("#safari-1").append(input1).append(input2).append(input3).append(input4).append(input5).append(input6).append(input7);
      $("#mySub").click();    
    } else {
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
  }

  if ($('[data-form=payment]')[0]) {
    $('[data-form=payment]').submit(contractLogin)

    // autocompletion number of contract from url
    $('[data-form=payment] input[name=contract]').val(contractNumber || '')
  }
}(window.$, window.VP))