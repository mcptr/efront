define([
	"jquery",
	"backbone",
	"init/setup",
	"core/logger",
	"core/api",
	"core/routing",
	"views/debug",
	"views/error",
	"controllers/index",
	"models/user"
], function($, Backbone, Setup, Logger, Api, Routing,
			DebugView, Error, Index, UserModel) {


	var App = {
		Models: {},
		Collections: {},
		Views: {},
		Routers: {},
		Controllers: {},
		api: new Api(),
		init: function () {
			var defaultViewComponents = [
				"search", "sideSearch", "tags", "topPosts"
			];

			this.setup = new Setup(this.api);
			this.setup.init({
				"defaultViewComponents": defaultViewComponents
			});
		},
		onSessionSync: function(response) {
			var self = this;
			$.ajaxSetup({
				headers: {
					"X-App-Session": response.id
 				}
			});
			this.api.user = new UserModel({
				id: (this.api.session.get("user_id") || 0)
			});
			this.api.user.fetch().always(function() {
				self.api.event.trigger("app/ready");
			});
		},
		createSession: function() {
			var self = this;
			console.log("Creating new session");
			$.post(self.api.session.urlRoot).then(
				function(response) {
					self.api.localStorage.session_id = response.id;
					self.api.session.set({id: response.id});
					// refresh session
					self.api.session.fetch().then(
						function(response) { self.onSessionSync(response); },
						function(response) { self.onInitError(response); }
					);
				},
				function(response) {
					console.error("Failed to initialize session.", response);
				}
			);
		},
		initSesssion: function(sessionId) {
			var self = this;
			console.log("Initializing session", this.api);
			if(sessionId) {
				self.api.session.set({id: sessionId});
				self.api.session.fetch().then(
					function(response) { self.onSessionSync(response); },
					function(response) { self.createSession(); }
				);
			}
			else {
				self.createSession();
			}

		},
		start: function() {
			var self = this;
			var ls = this.api.localStorage;

 			var sessionId = self.api.localStorage.session_id;
			console.log("Local SessionID: ", sessionId);

			this.api.event.on("app/ready", function() {
				self.initUI();
				self.routing = new Routing(self.api);
				self.routing.init();
			});

			self.initSesssion(sessionId)
		},
		initUI : function() {
			var indexCtrl = new Index(this.api);
		},
		onInitError : function(response) {
			var view = new Error({
				el: $(document.body),
				className: "init-error",
			});
			view.render({
				replace: true,
				message: "Service currently unavailable",
				details: [
					"Please try again later."
				],
				errorId: "InitializationError: " + (new Date()).toUTCString(),
				traceback: (response.statusText + " (" + response.status + ")")
			});
		},
		logging: new Logger("APPLICATION")
	};

	return App;
});
