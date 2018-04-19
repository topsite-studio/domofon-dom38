(function (ymaps, $) {
  'use strict'

  if (document.querySelector('.page--keyretailers')) {
    console.log('key retailers map')
    document.addEventListener('DOMContentLoaded', keyretail)
  }

  function keyretail () {
    console.log('keyretail()!')
    var tableRowsInPage = 10
    ymaps.ready(init)

    function reorderKeyStores (data) {
      var geoObjects = []

      data.map(function (item) {
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
          geoObjects.push(placemark)
        }
      })

      return geoObjects
    }

    function addRowToTable (info) {
      var storesList = document.querySelector('#stores-list')
      var tr = document.createElement('tr')
      tr.className = 'table__row-content'
      tr.hidden = info.isHidden

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
      distance.dataset.lat = info.lat
      distance.dataset.lon = info.lon
      distance.innerText = info.distance
      tr.appendChild(distance)

      storesList.appendChild(tr)
    }

    /**
     * Псевдоподгрузка строчек в таблицу
     * @param  {[Object]} event Событие клика
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

    function init () {
      var geolocation = ymaps.geolocation

      var myMap = new ymaps.Map('map', {
        center: [52.266407, 104.281374],
        zoom: 11,
        controls: ['zoomControl', 'geolocationControl']
      })

      var userLocation

      geolocation.get({
        provider: 'browser',
        mapStateAutoApply: false
      }).then(function (result) {
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon')
        userLocation = result.geoObjects
        myMap.geoObjects.add(userLocation)

        $.getJSON('https://domofon.dom38.ru/api/keystores', function (data) {
          console.log(data)
          var placemarks = reorderKeyStores(data)
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

          function filteringWay (item) {
            return !item.isOff
          }

          var FINAL_DATA = data.filter(filteringWay)
          FINAL_DATA = FINAL_DATA.sort(comparingWay)

          console.log(FINAL_DATA)

          FINAL_DATA.map(function (item, index) {
            var distance = (userLocation !== null) ? parseInt(ymaps.coordSystem.geo.getDistance(userLocation.position, [item.lat, item.lon])) + ' м' : ''
              addRowToTable({
                title: item.name,
                address: item.city + ', ' + item.address,
                worktime: item.worktime,
                image: item.shortImageUrl,
                distance: distance,
                isHidden: index >= tableRowsInPage
              })
          })

          document.getElementById('load-more').hidden = false
          document.getElementById('load-more').addEventListener('click', pseudoLoadMore)

          clusterer.add(placemarks)
          myMap.geoObjects.add(clusterer)
          myMap.setBounds(clusterer.getBounds(), {
            checkZoomRange: true
          })
        })
      })
    }
  }
}(window.ymaps, window.$))
