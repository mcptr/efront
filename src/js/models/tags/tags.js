define(["backbone", "models/tags/tag"], function(Backbone, TagModel) {
    var Tags = Backbone.Collection.extend({
		model: TagModel,
        url: "/api/posts/tags/",
        initialize: function() {
		},
		parse: function(response, options) {
			return response.list;
		}
    });

	return Tags;
});
