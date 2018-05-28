(function (ymaps) {
  'use strict'

  if (document.querySelector('.page--contacts')) document.addEventListener('DOMContentLoaded', contacts)

  function contacts () {
    var myMap
    var mark = [52.281688, 104.311922]
    ymaps.ready(initMap)
    function initMap () {
      myMap = new ymaps.Map('map', {
        center: mark,
        zoom: 13,
        controls: ['zoomControl', 'geolocationControl']
      })

      var placemark = new ymaps.Placemark(mark)
      myMap.geoObjects.add(placemark)

      if (document.body.clientWidth <= 767) myMap.setZoom(15)
    }
  }
})(window.ymaps)
