define(["backbone", "models/jobs/job"], function(Backbone, JobModel) {
    var List = Backbone.Collection.extend({
		model: JobModel,
		url: "/api/jobs",
        initialize: function() {
		},

        parse: function(response, options)  {
            return response;
        }
    });

	return List;
});
