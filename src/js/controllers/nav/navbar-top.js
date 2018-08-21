define([
	"core/controller",
	"backbone",
	"views/nav/navbar-top",
	"models/categories/categories"
], function(Controller, Backbone, NavTopView, CategoriesModel) {
	var NavbarTop = Controller.extend({
        initialize: function(args) {
			var self = this;

			this.view = new NavTopView({
				el: "#navbar-top",
			});

			Backbone.history.on("route", function() {
				self.handleRoute();
			});
		},
		handleRoute: function() {
			var fragment = Backbone.history.getFragment();
			this.view.render({});
			this.view.setActive(fragment);
		}
	});

	return NavbarTop;
});
