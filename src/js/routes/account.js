define([
	"backbone",
	"controllers/account/main",
	"controllers/account/dashboard"
], function(Backbone, Main, Dashboard) {
    var Account = Backbone.Router.extend({
		name: "Account",
		routes: {
			"account(/)" : function() {
				this.dispatch(Main, arguments);
			},
			"account/dashboard(/)" : function() {
				this.dispatch(Dashboard, arguments);
			},
		}
    });

	return Account;
});
