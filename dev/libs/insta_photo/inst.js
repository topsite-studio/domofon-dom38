/* Получение фото из Инстаграм */

(function ($) {
	$.fn.instagramGet = function (options) {

		// По умолчанию
		var defaults = {
			"user_id": null,
			"access_token": null,
			"count": 10
		};

		var o = $.extend(defaults, options);

		return this.each(function () {

			// Переменные
			var elem = $(this),
				url = "https://api.instagram.com/v1/users/" + o.user_id + "/media/recent?access_token=" + o.access_token + "&count=" + o.count + "&callback=?";
			
			// Получение изображений
			$.getJSON(url, function(data){
				$.each(data.data, function (i, val) {
					var li = $("<div/>", {"href": val.images.standard_resolution.url}).appendTo(elem).addClass('inst_block_item').addClass('fancybox'),
//						img = $("<img/>", {"src": val.images.low_resolution.url, "alt": ''}).appendTo(li);
						img = $("<img/>", {"src": val.images.standard_resolution.url, "alt": ''}).appendTo(li);

					if (val.caption){
						// img.attr("title", val.caption.text);
					}
				});
			});

			if(o.user_id == null || o.access_token == null){
				elem.append("<li>Мы забыли идентификатор и токен пользователя Инстаграм.</li>");
			}

		});
	};
})(jQuery);
