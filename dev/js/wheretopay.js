(function (ymaps, $) {
  'use strict'

  if (document.querySelector('.page--wheretopay')) {
    document.addEventListener('DOMContentLoaded', whereToPay)
  }

  function whereToPay () {
    var myMap
    ymaps.ready(init)

    function reorderFeeStations (map, data) {
      map.geoObjects.removeAll()
      var geoObjects = []

      data.map(function (item) {
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

    function addRowToTable (info) {
      var storesList = document.querySelector('#stores-list')
      var tr = document.createElement('tr')
      tr.className = 'table__row-content'
      tr.dataset.category = info.category

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

    function filter (category, data) {
      console.groupCollapsed('filter(button, data)')
      console.log('Фильтруем! Категория: ' + category)

      var filteredData
      var tableRows = document.querySelectorAll('.table__row-content')

      for (var i = 0; i < tableRows.length; i++) {
        var row = tableRows[i]
        row.hidden = category === 'all' ? false : (row.dataset.category === category)
      }

      filteredData = category === 'all' ? data : data.filter(function (item) {
        return (item.type === category)
      })
      console.log(filteredData)

      var filteredPlacemarks = reorderFeeStations(myMap, filteredData)
      var filteredCluster = new ymaps.Clusterer({
        groupByCoordinates: false
      })
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
      myMap.geoObjects.add(filteredCluster)

      console.groupEnd()
      return true
    }

    function init () {
      var geolocation = ymaps.geolocation

      myMap = new ymaps.Map('map', {
        center: [52.266407, 104.281374],
        zoom: 11,
        controls: ['zoomControl', 'geolocationControl']
      })

      var stations = []
      var userLocation

      geolocation.get({
        provider: 'browser',
        mapStateAutoApply: false
      }).then(function (result) {
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon')
        userLocation = result.geoObjects
        myMap.geoObjects.add(userLocation)

        $.getJSON('https://domofon.dom38.ru/api/fee-stations/sberbank', function (sberbank) {
          stations = stations.concat(sberbank)
          $.getJSON('https://domofon.dom38.ru/api/fee-stations/uplati', function (uplati) {
            stations = stations.concat(uplati)

            document.querySelector('.map__filter').hidden = false

            var placemarks = reorderFeeStations(myMap, stations)
            var clusterer = new ymaps.Clusterer({
              preset: 'islands#invertedBlueClusterIcons',
              groupByCoordinates: false
            })

            function comparingWay (a, b) {
              var distance = {
                a: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.position, [a.lat, a.lon]) : 0,
                b: (userLocation !== null) ? ymaps.coordSystem.geo.getDistance(userLocation.position, [b.lat, b.lon]) : 0
              }
              return distance.a - distance.b
            }

            stations.sort(comparingWay)

            stations.map(function (item, index) {
              var distance = (userLocation !== null) ? parseInt(ymaps.coordSystem.geo.getDistance(userLocation.position, [item.lat, item.lon])) + ' м' : ''
              // console.log(placemark.geometry.getCoordinates())
              // Добавляем пункт продажи в таблицу
              addRowToTable({
                title: item.name,
                address: item.address,
                lat: item.lat,
                category: item.type,
                lon: item.lon,
                distance: distance
              })

              if (index === 0) {
                document.querySelector('.table__row-content').classList.add('table__row-content--red')
              }
            })

            $('.map__btn[data-category]').click(function () {
              if ($(this).hasClass('map__btn--active') === false) {
                $('.map__btn--active').removeClass('map__btn--active')
                $(this).toggleClass('map__btn--active')
                filter($(this).data('category'), stations)
              }
            })

            clusterer.add(placemarks)
            myMap.geoObjects.add(clusterer)
            myMap.setBounds(clusterer.getBounds(), {
              checkZoomRange: true
            })
          })
        })
      })
    }
  }
}(window.ymaps, window.$))
