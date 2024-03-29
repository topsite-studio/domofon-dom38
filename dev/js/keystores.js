(function (ymaps, $) {
  'use strict'

  if (document.querySelector('.page--keyretailers')) {
    console.log('key retailers map')
    document.addEventListener('DOMContentLoaded', keyretail)
  }

  /**
   * Глобальная функция страницы пунктов продажи ключей
   */
  function keyretail () {
    console.groupCollapsed('Запуск функции keyretail()')

    var myMap

    /**
     * Кнопка подгрузки
     * @type {HTMLElement}
     */
    var loadMoreButton = document.getElementById('load-more')
    /**
     * Максимальное количество строк в "странице" таблице
     * @type {number}
     */
    var tableRowsInPage = 10
    ymaps.ready(init)

    /**
     * Парсинг строки,
     * поиск содержания переменной в адресной строке. IE не поддерживает встроенную функцию
     */
    function varParser(str, name) {
      console.groupCollapsed('Запуск функции varParser()')
      function findingAmp(s) {
        return s.indexOf('&') === -1 ? s.length : s.indexOf('&');
      }

      if(str.indexOf(name) !== -1) {
        return str.substr(str.indexOf(name) + name.length + 1, findingAmp(str.substr(str.indexOf(name) + name.length + 1, str.length)));
      } else {
        return null;
      }
    }
    /**
    * Автоматический сабмит по гет-запросу
    */
    var url_string = window.location.href;
    var houseId = varParser(url_string, 'house')


    /**
     * Получение массива геообъектов для карты<br>
     * <strong>Важное замечание:</strong> Функция не добавляет геообъекты на карту самостоятельно!
     * @param  {Array} data Массив с данными о точках, полученный через API
     * @return {Array}      Массив с геообъектами
     */
    function reorderKeyStores (data) {
      console.groupCollapsed('Запуск функции reorderKeyStores()')
      var geoObjects = []

      data.forEach(function (item, index) {
        if (index === 0) console.debug(item)
        // Если координаты пункта обнародованы
        if (!item.isOff) {
          // Добавляем пункт продажи на карту
          var placemark = new ymaps.GeoObject({
            geometry: {
              type: 'Point',
              coordinates: [item.lat, item.lon]
            },
            properties: {
              balloonContentHeader: item.name,
              balloonContentBody: '<address><p>' + item.city + ', ' + item.address + '<br><time>' + item.worktime + '</time></p></address>',
              balloonContentFooter: '<em>' + item.lat + ', ' + item.lon + '</em>',
              closeButton: false
            }
          })
          if (index === 0) console.debug(placemark)
          geoObjects.push(placemark)
        }
      })
      console.groupEnd()

      return geoObjects
    }

    /**
     * Добавление строки в таблицу
     * @param {{ title: string, address: string, worktime: string, image: string, distance: string, isHidden: boolean }} info Инфа, передаваемая в строку
     */
    function addRowToTable (info) {
      var storesList = document.querySelector('#stores-list')
      var tr = document.createElement('tr')
      tr.className = 'table__row-content'
      tr.hidden = info.isHidden
      tr.dataset.lat = info.lat
      tr.dataset.lon = info.lon

      var title = document.createElement('td')
      title.className = 'table__td table__td--title'
      title.dataset.title = 'Наименование'
      title.innerText = info.title !== 'undefined' ? info.title : ''
      tr.appendChild(title)

      var address = document.createElement('td')
      address.className = 'table__td'
      address.dataset.title = 'Адрес'
      address.innerText = info.address
      tr.appendChild(address)

      var schedule = document.createElement('td')
      schedule.className = 'table__td'
      schedule.dataset.title = 'Режим работы'
      schedule.innerHTML = '<time>' + info.worktime + '</time>'
      tr.appendChild(schedule)

      var image = document.createElement('td')
      image.className = 'table__td'
      image.dataset.title = 'Схема проезда'
      image.innerHTML = info.image ? "<a data-fancybox='scheme' data-caption='" + info.title + "' href='" + info.image + "' class='link link--dashed'>Показать схему проезда</a>" : ''
      tr.appendChild(image)

      var distance = document.createElement('td')
      distance.className = 'table__td'
      distance.dataset.title = 'Расстояние'
      distance.innerText = info.distance
      tr.appendChild(distance)
      storesList.appendChild(tr)
    }

    /**
     * Псевдоподгрузка строчек в таблицу
     * @param  {event} event Событие клика
     */
    function pseudoLoadMore (event) {
      event.preventDefault()
      var button = event.target
      var list = document.querySelectorAll('.table__row-content[hidden]')

      if (list.length > 0) {
        button.hidden = false
        for (var i = 0; i < list.length && i < tableRowsInPage; i++) {
          list[i].hidden = false
        }
      } else {
        button.hidden = true
      }

      return true
    }

    /**
     * Инициализация Яндекс-карты и запуск всех основных функций
     */
    function init () {
      console.groupCollapsed('Запуск функции init()')
      var geolocation = ymaps.geolocation

      myMap = new ymaps.Map('map', {
        center: [52.266407, 104.281374],
        zoom: 11,
        controls: ['zoomControl', 'geolocationControl']
      })

      var userLocation

      geolocation.get({
        provider: 'auto',
        mapStateAutoApply: false
      })
      .then(function(result){
        if(houseId){
          console.groupCollapsed('Проверка номера дома из хэша')
          return $.getJSON('//domofon.dom38.ru/api/houses/coords/' + houseId)
            .then(function(coords){
              console.groupCollapsed('Создание метки')
              if(coords){
                userLocation = new ymaps.Placemark([coords.lat,coords.lon])
                userLocation.options.set('preset', 'islands#redPersonCircleIcon')
                myMap.geoObjects.add(userLocation)
              }
              return $.getJSON('//domofon.dom38.ru/api/keystores')
            })
        } else {
          console.groupCollapsed('Получение местоположения пользователя')
          // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
          userLocation = new ymaps.Placemark([result.geoObjects.position[0],result.geoObjects.position[1]])
          userLocation.options.set('preset', 'islands#redPersonCircleIcon')
        }

        myMap.geoObjects.add(userLocation)
        return $.getJSON('//domofon.dom38.ru/api/keystores')
      })
      .then(function (data) {
        console.groupCollapsed('Сортировка и вывод точек магазинов')
        var FINAL_DATA = data.filter(filteringWay)
        FINAL_DATA = FINAL_DATA.sort(comparingWay)

        FINAL_DATA.forEach(function (item, index) {
          var distance = (userLocation !== null) ? parseInt(ymaps.coordSystem.geo.getDistance(userLocation.geometry.getCoordinates(), [item.lat, item.lon])) + ' м' : ''
          addRowToTable({
            title: item.name,
            address: item.city + ', ' + item.address,
            worktime: item.worktime,
            image: item.shortImageUrl,
            distance: distance,
            isHidden: index >= tableRowsInPage,
            lat: item.lat,
            lon: item.lon
          })
        })

        document.querySelector('#stores-list').addEventListener('click', function (e) {
          console.log(e)
          var condition = (e.target.tagName.toLowerCase() === 'tr' || e.target.parentElement.tagName.toLowerCase() === 'tr')
          var row = e.target.tagName.toLowerCase() === 'tr' ? e.target : e.target.parentElement
          console.log(row)
          var coords = [
            parseFloat(row.dataset.lat),
            parseFloat(row.dataset.lon)
          ] 
          if (condition) {
            $('html,body').animate({ scrollTop: $('#map').offset().top - 50 }, 750,
              function completeAnimation () {
                console.log('completeAnimation')
                myMap.setCenter(coords, 13)
              }
            )
          }
          return condition
        })

        loadMoreButton.hidden = false
        loadMoreButton.addEventListener('click', pseudoLoadMore)

        var placemarks = reorderKeyStores(FINAL_DATA)
        var clusterer = new ymaps.Clusterer({
          preset: 'islands#invertedBlueClusterIcons',
          groupByCoordinates: false
        })
        clusterer.add(placemarks)
        myMap.geoObjects.add(clusterer)
        myMap.setBounds(clusterer.getBounds(), {
          checkZoomRange: true
        })

        var closestDot = myMap.geoObjects.get(1).getGeoObjects()[0]
        closestDot.options.set('preset', 'islands#redDotIcon')

        if (userLocation) {
          myMap.events.add('boundschange', function (event) {
            if (closestDot.getParent() === null) {
              var allClusters = myMap.geoObjects.get(1).getClusters()
              if (allClusters.length > 0) {
                var closestCluster = allClusters.sort(function (a, b) {
                  var distance = {
                    a: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.geometry.getCoordinates(), a.geometry.getCoordinates()) : 0,
                    b: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.geometry.getCoordinates(), b.geometry.getCoordinates()) : 0
                  }
                  return distance.a - distance.b
                })
                var cluster = closestCluster[0]
                cluster.options.set('preset', 'islands#invertedRedClusterIcons')
              }
            }
          })
        }

        function comparingWay (a, b) {
          var distance = {
            a: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.geometry.getCoordinates(), [a.lat, a.lon]) : 0,
            b: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.geometry.getCoordinates(), [b.lat, b.lon]) : 0
          }
          return distance.a - distance.b
        }

        function filteringWay (item) {
          return !item.isOff
        }
      })
    }
  }
}(window.ymaps, window.$))
