(function ($, Tooltip) {
  'use strict'

  var toolTips = $('.tooltips')
  toolTips.each(function (index, el) {
    var toolData = $(this).data('tooltips')
    var tooltipie = new Tooltip(el, {
      title: toolData,
      placement: 'top',
      html: true,
      template: '<div class="tooltip" role="tooltip"><button type="button" class="tooltip-close">&times;</button><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      popperOptions: {
        onCreate: function (event) {
          var tooltip = event.instance.popper
          var closeButton = tooltip.children[0]
          closeButton.addEventListener('click', function (e) {
            e.preventDefault()
            tooltip.style.display = 'none'
          })
        }
      }
    })
  })
}(window.$, window.Tooltip))
