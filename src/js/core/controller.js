define(["backbone", "utils/class"], function(Backbone, Class) {
	var Controller = Class.extend({
		api: null,
		scope: {},
		view: null,
		model: null,
		route: null,
		request: null,
		viewComponents: null,
		init: function() {
			// JS is so funny.
			// Let's do some shi(f)ting and po(o)ping, while
			// penetrating this thingy from both sides.
			var args = [];
			for (var i = 0, l = arguments.length; i < l; i++) {
				args.push(arguments[i]);
			}

			if(!args.length) {
				console.error("Invalid arguments passed to Controller");
			}

			this.api = args.shift();
			this.route = Backbone.history.location.pathname;
			if(args.length) {
				this.request = args.pop();
			}
			this.initialize.apply(this, args[0]);
		},
		initialize: function() {
		},
		getViewComponents: function() {
			return this.viewComponents;
		},
	});

	return Controller;
});
