define(["jquery"], function($, animo) {

	function flash($elem, times, speed, fadeInSpeed) {
		times = (times || 3);
		speed = (speed || 100);
		fadeInSpeed = (fadeInSpeed || 300);
		for(var i = 0; i < times; i++) {
			i % 2 ? $elem.fadeIn(speed) : $elem.fadeOut(speed);
		}
		$elem.fadeIn((fadeInSpeed || speed));
	}

	$.fn.flash = function() {
		var self = this;
		this.addClass("animate-flash");
		setTimeout(function() {
			self.removeClass("animate-flash");
		}, 1500);
	};

	return {
		flash: flash
	};
});
