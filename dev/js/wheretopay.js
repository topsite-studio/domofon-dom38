(function (ymaps, $) {
  'use strict'

  if (document.querySelector('.page--wheretopay')) {
    document.addEventListener('DOMContentLoaded', whereToPay)
  }

  /**
   * Глобальная функция страницы пунктов оплаты
   */
  function whereToPay () {
    var myMap
    var userLocation
    ymaps.ready(init)

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

    /**
     * Получение массива геообъектов для карты<br>
     * <strong>Важное замечание:</strong> Функция не добавляет геообъекты на карту самостоятельно!
     * @param  {ymaps.Map} map  Объект Яндекс-карты, <code>ymaps.Map</code>
     * @param  {Array} data Массив с данными о точках, полученный через API
     * @return {Array}      Массив с геообъектами
     */
    function reorderFeeStations (map, data) {
      if (map.geoObjects.get(1)) {
        map.geoObjects.get(1).removeAll()
      }
      var geoObjects = []

      data.forEach(function (item) {
        // Если координаты пункта обнародованы
        if (item.published) {
          // Добавляем пункт продажи на карту
          var placemark = new ymaps.GeoObject({
            geometry: {
              type: 'Point',
              coordinates: [item.lat, item.lon]
            },
            properties: {
              balloonContentHeader: item.params.hint,
              balloonContentBody: '<address><p>' + item.address + '</p></address>',
              balloonContentFooter: '<em>' + item.lat + ', ' + item.lon + '</em>',
              closeButton: false
            }
          })
          geoObjects.push(placemark)
        }
      })

      return geoObjects
    }

    /**
     * Добавление строки в таблицу
     * @param {{ title: string, address: string, lat: string, category: string, lon: string, distance: string, isHidden: boolean }} info Инфа, передаваемая в строку
     */
    function addRowToTable (info) {
      var storesList = document.querySelector('#stores-list')
      var tr = document.createElement('tr')
      tr.className = 'table__row-content'
      tr.dataset.category = info.category
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
      address.innerText = info.address !== 'undefined' ? info.address : ''
      tr.appendChild(address)

      var distance = document.createElement('td')
      distance.className = 'table__td table__td--distance'
      distance.dataset.lat = info.lat
      distance.dataset.lon = info.lon
      distance.dataset.title = 'Расстояние'
      distance.dataset.distance = info.distance
      distance.innerText = info.distance
      tr.appendChild(distance)

      storesList.appendChild(tr)
    }

    /**
     * Фильтрация пунктов на карте и в таблице
     * @param  {string} category Строка, взятая из дата-атрибута кнопки, которой вызвали эту функцию. По ней и происходит фильтрация
     * @param  {Array} data     Массив, полученный через API
     * @return {true}
     */
    function filter (category, data) {
      console.groupCollapsed('filter(button, data)')
      console.log('Фильтруем! Категория: ' + category)

      var filteredData
      var tableRows = document.querySelectorAll('.table__row-content')

      for (var i = 0; i < tableRows.length; i++) {
        var row = tableRows[i]
        console.log(row.dataset.category === category)
        row.hidden = category === 'all' ? false : row.dataset.category !== category
      }

      // Скрываем первые 10 строчек
      var filteredRows = category === 'all' ? tableRows : document.querySelectorAll('.table__row-content[data-category="' + category + '"]')
      console.log(filteredRows)
      for (var k = 0; k < filteredRows.length; k++) {
        console.log(k > tableRowsInPage)
        filteredRows[k].hidden = k >= tableRowsInPage
      }

      loadMoreButton.hidden = filteredRows.length <= tableRowsInPage

      filteredData = category === 'all' ? data : data.filter(function (item) {
        return (item.type === category)
      })

      var filteredPlacemarks = reorderFeeStations(myMap, filteredData)
      var filteredCluster = myMap.geoObjects.get(1)
      switch (category) {
        case 'sberbank':
          filteredCluster.options.set({
            preset: 'islands#invertedGreenClusterIcons'
          })
          break
        case 'gorod':
          filteredCluster.options.set({
            preset: 'islands#invertedOrangeClusterIcons'
          })
          break
        default:
          filteredCluster.options.set({
            preset: 'islands#invertedBlueClusterIcons'
          })
          break
      }
      filteredCluster.add(filteredPlacemarks)
      findClosestPlace(userLocation)

      console.groupEnd()
      return true
    }

    /**
     * Псевдоподгрузка строчек в таблицу
     * @param  {[object Object]} event Событие клика
     */
    function pseudoLoadMore (event) {
      event.preventDefault()
      var button = event.target
      var filter = ''
      if (document.querySelector('.map__filter')) {
        var category = document.querySelector('.map__btn--active') ? document.querySelector('.map__btn--active').dataset.category : 'all'
        filter = category === 'all' ? '' : '[data-category="' + category + '"]'
      }
      var list = document.querySelectorAll('.table__row-content' + filter + '[hidden]')

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
     * Поиск ближайшей к пользователю точки
     * @param {object Object} userLocation Геообъект местоположения пользователя. Если он равен null или не передан в функцию, то функция не сработает
     */
    function findClosestPlace (userLocation) {
      var closestDot
      if (userLocation) {
        closestDot = myMap.geoObjects.get(1).getGeoObjects()[0]
        closestDot.options.set('preset', 'islands#redDotIcon')

        markAsClosest()
        console.log(myMap.events.group())

        if (!myMap.events.group().events.types.boundschange[20]) {
          myMap.events.add('boundschange', markAsClosest)
        }
      }
      function markAsClosest () {
        if (closestDot.getParent() === null) {
          var allClusters = myMap.geoObjects.get(1).getClusters()
          if (allClusters.length > 0) {
            var closestCluster = allClusters.sort(function (a, b) {
              var distance = {
                a: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.position, [a.geometry.getCoordinates()[0], a.geometry.getCoordinates()[1]]) : 0,
                b: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.position, [b.geometry.getCoordinates()[0], b.geometry.getCoordinates()[1]]) : 0
              }
              return distance.a - distance.b
            })
            var cluster = closestCluster[0]
            cluster.options.set('preset', 'islands#invertedRedClusterIcons')
          }
        }
      }
    }

    /**
     * Инициализация Яндекс-карты и запуск всех основных функций
     */
    function init () {
      var geolocation = ymaps.geolocation

      myMap = new ymaps.Map('map', {
        center: [52.266407, 104.281374],
        zoom: 12,
        controls: ['zoomControl', 'geolocationControl']
      })

      var stations = []

      geolocation.get({
        provider: 'auto',
        mapStateAutoApply: false
      }).then(function (result) {
        result.geoObjects.options.set('preset', 'islands#redPersonCircleIcon')
        userLocation = result.geoObjects
        myMap.geoObjects.add(userLocation)

        document.body.clientWidth <= 767 ? myMap.setCenter(userLocation.position, 14) : myMap.setCenter(userLocation.position)

        $.getJSON('https://domofon.dom38.ru/api/fee-stations/sberbank', function (sberbank) {
          stations = stations.concat(sberbank)
          $.getJSON('https://domofon.dom38.ru/api/fee-stations/uplati', function (uplati) {
            stations = stations.concat(uplati)

            document.querySelector('.map__filter').hidden = false

            var FINAL_DATA = stations.filter(function (item) {
              return item.published
            })
            FINAL_DATA = FINAL_DATA.sort(comparingWay)

            var placemarks = reorderFeeStations(myMap, FINAL_DATA)
            var clusterer = new ymaps.Clusterer({
              preset: 'islands#invertedBlueClusterIcons',
              groupByCoordinates: false
            })
            clusterer.add(placemarks)
            myMap.geoObjects.add(clusterer)
            // myMap.setBounds(clusterer.getBounds(), {
            //   checkZoomRange: true
            // })

            function comparingWay (a, b) {
              var distance = {
                a: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.position, [a.lat, a.lon]) : 0,
                b: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.position, [b.lat, b.lon]) : 0
              }
              return distance.a - distance.b
            }

            findClosestPlace(userLocation)

            FINAL_DATA.forEach(function (item, index) {
              var distance = (userLocation !== null) ? parseInt(ymaps.coordSystem.geo.getDistance(userLocation.position, [item.lat, item.lon])) + ' м' : ''
              // console.log(placemark.geometry.getCoordinates())
              // Добавляем пункт продажи в таблицу
              addRowToTable({
                title: item.name,
                address: item.address,
                lat: item.lat,
                category: item.type,
                lon: item.lon,
                distance: distance,
                isHidden: index >= tableRowsInPage
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
              console.log(coords)
              if (condition) {
                $('html,body').animate({ scrollTop: $('#map').offset().top - 50 }, 750,
                  function completeAnimation () {
                    console.log('completeAnimation')
                    myMap.setCenter(coords, 15)
                  }
                )
              }
              return condition
            })

            $('.map__btn[data-category]').click(function () {
              if ($(this).hasClass('map__btn--active') === false) {
                $('.map__btn--active').removeClass('map__btn--active')
                $(this).toggleClass('map__btn--active')
                filter($(this).data('category'), FINAL_DATA)
              }
            })

            loadMoreButton.hidden = document.querySelectorAll('.table__row-content').length <= tableRowsInPage
            loadMoreButton.addEventListener('click', pseudoLoadMore)
          })
        })
      })
    }
  }
}(window.ymaps, window.$))
