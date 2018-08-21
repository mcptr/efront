define([
	"jquery",
	"backbone",
	"routes/main",
	"routes/account",
], function($, Backbone, Main, Account) {

	function Routing(api) {
		var routers = {};

		this.init = function(errorHandler) {
			routers.main = new Main(api);
			Backbone.history.start({pushState: true});
			this.setListeners();
		};

		this.setListeners = function() {
			api.event.on("navigateHash", function(hash) {
				Backbone.history.location.hash = hash;
			});
		};
	};

	return Routing;
});
