/**
 * JQuery ListFilter plugin
 *
 * Filters a HTML list (defined as <element data-listfilter-list="ul#some-list">)
 *
 * Usage:
 *   $('form').listFilter();
 *
 * The list items can be filtered by an attribute:
 *   <element data-listfilter-by-attribute="true"> ("data-listfilter-index" as default)
 *   <element data-listfilter-by-attribute="data-title">
 *
 * Note: index value in data attribute should be lowecased.
 *
 * or by children element:
 *   <element data-listfilter-by-element="h3:contains({{value}})">
 *
 * Note: by-attribute method is much faster than byElement, because of CSS3 native selector usage
 *
 *
 * @version 0.2
 * @since 2014-01
 * @author Mateusz Janik
 *
 */
(function(global){
	var ns = 'listfilter';

	/**
	 * JQuery plugin
	 */
	(function($){
		var pluginName = 'listFilter';

		$.fn[pluginName] = function(o) {
			var options = $.extend({}, $.fn[pluginName].defaults, o);

			this.each(function () {
				var $el = $(this),
					$input = $el.find('input[type=search]'),
					$submit = $el.find('button'),
					$list = $($el.data(ns + 'List')),
					$items = $list.children().addClass('listfilter-item'),

					listItem = $el.data(ns + 'ListItem') || '',
					byElement = $el.data(ns + 'ByElement'),
					byAttribute = $el.data(ns + 'ByAttribute')
				;

				if (byAttribute) {
					var listID = $list[0].id;

					// List id must be specified
					if (!listID) {
						return false
					}

					var $searchStyle = $('<style type="text/css" id="listfilter-style-' + (Math.round(new Date().getTime() + (Math.random() * 100))) + '"></style>')
						.appendTo('head');

					// Use default (data-listfilter-list) attribute if not specified
					byAttribute = typeof byAttribute === 'string' ? byAttribute : ('data-' + ns + '-index');
				}

				if ($submit.length) {
					$submit.on('click', function(){
						_search($input)
					});
				} else {
					$input.on(options.eventType, function(){
						_search($input)
					}).on('search', function () {
						if ($input.val() === '') {
							_search($input);
						}
					});
				}

				function _search($inp){
					if (byElement) {
						if ($inp.val() === '') {
							$items.removeClass(ns + '-item--hidden');
						} else {
							var selector = byElement.replace('{{value}}', $inp.val());

							var $found = $items.removeClass(ns + '-item--hidden').filter(function(){
								return $(this).find(selector).length > 0
							});

							$items.not($found).addClass(ns + '-item--hidden');
						}

					} else if (byAttribute) {
						if ($inp.val() === '') {
							$searchStyle.html('');
						} else {
							$searchStyle.html('#' + listID + " > " + listItem + ":not([" + byAttribute + "*=\"" + $inp.val().toLowerCase() + "\"]) { display: none; }");
						}
					}
				}

			});

			return this;
		}

		$.fn[pluginName].defaults = {
			eventType: 'keyup'
		}
	})(jQuery);

})(window);
