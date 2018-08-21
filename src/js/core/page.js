define(
	[
		"underscore",
		"jquery",
		"backbone"
	],
	function(_, $, Backbone) {

		function Page(api) {
			var self = this;
			self._api = api;

			this.saveOffsetY = function(place) {
				place = (place || Backbone.history.getFragment());
				api.cacheService.set(place, $(window).scrollTop());
				// console.log("SAVE", place, api.cacheService.get(place));
				// console.log(api.cacheService.getCache());
			};

			this.restoreOffsetY = function(place) {
				place = (place || Backbone.history.getFragment());
				var pos = api.cacheService.get(place, 0);
				//console.log("RESTORE", place, pos);
				$(window).scrollTop(pos);
				api.cacheService.remove(place);
			};

			this.scrollTop = function(offset) {
				$(window).scrollTop((offset || 0));
			};

			function init() {
				var $w = $(window);
				$w.scroll(_.debounce(function() {
					self.saveOffsetY();
				}, 100));
			};

			init();
		};

		return Page;
	}
);
