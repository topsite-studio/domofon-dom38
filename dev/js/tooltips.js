(function ($, Tooltip) {
  'use strict'

  var tooltipLinks = $('.tooltips')
  if (tooltipLinks.length) {
    var emptyContainer = document.createElement('div')
    emptyContainer.className = 'tooltips-container'
    emptyContainer.style.position = 'static'
    emptyContainer.style.height = '0px'
    document.body.appendChild(emptyContainer)
  }
  tooltipLinks.each(function (index, el) {
    var toolData = $(this).data('tooltips')
    var tooltipie = new Tooltip(el, {
      title: toolData,
      placement: 'top',
      html: true,
      container: document.querySelector('.tooltips-container'),
      template: '<div class="tooltip" role="tooltip"><button type="button" class="tooltip-close">&times;</button><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      popperOptions: {
        onCreate: function (event) {
          var tooltip = event.instance.popper
          var closeButton = tooltip.children[0]

          closeButton.addEventListener('click', function () {
            tooltip.style.display = 'none'
          })
        }
      }
    })
  })

  tooltipLinks.click(function (e) {
    e.stopPropagation()
  })
}(window.$, window.Tooltip))
