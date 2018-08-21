define(["backbone"], function(Backbone) {
    var Job = Backbone.Model.extend({
		id: null,
        urlRoot: '/api/jobs/',

        initialize: function() {
		},

        defaults: {
			id: 0
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

	return Job;
});
