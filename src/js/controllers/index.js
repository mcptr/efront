define([
	"core/controller",
	"controllers/nav/navbar-top",
	"controllers/panel/side_panel",
	"views/debug"
], function(Controller, NavbarTop, SidePanel, DebugView) {
	var Index = Controller.extend({
        initialize: function(args) {
			var navbarTop = new NavbarTop(this.api);
			var rightView = new SidePanel(this.api);
			// var debugView = new DebugView({
			// 	el: "#debug",
			// 	api: this.api
			// });

			// debugView.render();
			// this.api.event.trigger("debug", "ASD");
        }
    });

	return Index;
});
