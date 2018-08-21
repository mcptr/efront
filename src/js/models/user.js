define(["backbone"], function(Backbone) {

    var User = Backbone.Model.extend({
		id: null,
        urlRoot: '/api/user/',

        initialize: function() {
		},

        // defaults: {
		// 	id: 1
        // },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

	return User;
});
