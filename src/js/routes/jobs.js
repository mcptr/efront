define([
	"backbone",
	"controllers/jobs/main",
	"controllers/jobs/details"
], function(Backbone, Main, Details) {
    var Jobs = Backbone.Router.extend({
		name: "Jobs",
		routes: {
			"jobs(/)" : function() {
				this.dispatch(Main, arguments);
			},
			"jobs/:id(/)" : function() {
				this.dispatch(Details, arguments);
			}
		}
    });

	return Jobs;
});
