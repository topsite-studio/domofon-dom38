(function (ymaps, $) {
  'use strict'

  if (document.querySelector('.page--wheretopay')) {
    document.addEventListener('DOMContentLoaded', whereToPay)
  }

  function whereToPay () {
    var myMap
    var ymaps = window.ymaps

    ymaps.ready(function () {
      var geolocation = ymaps.geolocation

      myMap = new ymaps.Map('map', {
        center: [geolocation.lat, geolocation.lon],
        zoom: 17,
        controls: ['zoomControl']
      })

      var userLocation = null

      geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
      }).then(function (result) {
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon')
        myMap.geoObjects.add(result.geoObjects)
      })

      reorderFeeStations(myMap, userLocation)
    })
  }

  function reorderFeeStations (map, userLocation) {
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
      var arr = []
      var clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedBlueClusterIcons',
        groupByCoordinates: false
      })
      for (var i = 0; i < list.length; i++) {
        var item = list[i]
        // Если координаты пункта обнародованы
        if (item.published) {
          // Добавляем пункт продажи на карту
          var placemark = new ymaps.Placemark([item.lat, item.lon], {
            balloonContentHeader: item.params.hint,
            balloonContentBody: '<address><p>' + item.address + '</p></address>',
            balloonContentFooter: '<em>' + item.lat + ', ' + item.lon + '</em>',
            closeButton: false
          })
          arr.push(placemark)

          // Добавляем пункт продажи в таблицу
          addRowToTable({
            title: item.params.name,
            address: item.address,
            lat: item.lat,
            lon: item.lon
          })
        }
      }
      console.log('Вот и перебрали все точки. Теперь выводим их в кластеризатор')
      clusterer.add(arr)
      console.log('А теперь добавляем кластеризатор на карту')
      map.geoObjects.add(clusterer)

      function addRowToTable (info) {
        var storesList = document.querySelector('#stores-list')
        var tr = document.createElement('tr')
        tr.classList = 'table__row-content'

        var title = document.createElement('td')
        title.classList = 'table__td'
        title.dataset.title = 'Наименование'
        title.innerText = info.title !== 'undefined' ? info.title : ''
        tr.appendChild(title)

        var address = document.createElement('td')
        address.classList = 'table__td'
        address.dataset.title = 'Адрес'
        address.innerText = info.address !== 'undefined' ? info.address : ''
        tr.appendChild(address)

        var distance = document.createElement('td')
        distance.classList = 'table__td'
        distance.dataset.lat = info.lat
        distance.dataset.lon = info.lon
        distance.dataset.title = 'Расстояние'
        distance.innerHTML = 'Неизвестно'
        tr.appendChild(distance)

        storesList.appendChild(tr)
      }
    }
  }
}(window.ymaps, window.$))
