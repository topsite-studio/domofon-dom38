(function (ymaps, $) {
  'use strict'

  if (document.querySelector('.page--keyretailers')) {
    console.log('key retailers map')
    document.addEventListener('DOMContentLoaded', keyretail)
  }

  function keyretail () {
    console.log('keyretail()!')
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

      var title = document.createElement('td')
      title.className = 'table__td'
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

      storesList.appendChild(tr)
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
      })

      $.getJSON('https://domofon.dom38.ru/api/keystores', function (data) {
        console.log(data)
        var placemarks = reorderKeyStores(data)
        var clusterer = new ymaps.Clusterer({
          preset: 'islands#invertedBlueClusterIcons',
          groupByCoordinates: false
        })

        data.map(function (item) {
          addRowToTable({
            title: item.name,
            address: item.city + ', ' + item.address,
            worktime: item.worktime,
            image: item.shortImageUrl
          })
        })

        clusterer.add(placemarks)
        myMap.geoObjects.add(clusterer)
        myMap.setBounds(clusterer.getBounds(), {
          checkZoomRange: true
        })
      })
    }
  }
}(window.ymaps, window.$))
