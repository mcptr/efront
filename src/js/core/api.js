define([
	"underscore",
	"backbone",
	"core/logger",
	"core/page",
	"core/service/cache",
	"models/session",
	"models/user",
	"helpers/helpers"
], function(_, Backbone, Logger, Page, CacheService, SessionModel, UserModel, Helpers) {
	var Api = function() {
		var event = _.extend({}, Backbone.Events);
		var debug = function(msg, data) {
			event.trigger("debug", {
				message: msg,
				data: data
			});
		};

		var modules = {
			session: new SessionModel({id: null}),
			user: new UserModel({id: null}),
			localStorage: window.localStorage,
			sessionStorage: window.sessionStorage,
			event: event,
			helpers: Helpers,
			cacheService: new CacheService()
		};

		modules.logging = new Logger("MAIN", modules);
		modules.page = new Page(modules);

		modules.session.on("change", function(data) {
			console.log("Session changed", data.toJSON(), data.get("user_id"));
			modules.user = new UserModel({id: (data.get("user_id") || 0)});
		});

		return modules;
	};

	return Api;
});
