define(["backbone", "core/utils", "models/posts/post"], function(Backbone, Utils, PostModel) {

    var PostsCollection = Backbone.Collection.extend({
		model: PostModel,
		url: "/api/posts/",
        initialize: function(category, criteria) {
			criteria = (criteria || {});
			if(category) {
				this.url = Utils.string.format("{baseUrl}{category}/", {
					baseUrl: this.url,
					category: category
				});
			}
		},

        parse: function(response, options)  {
            return response.list;
        }
    });

	return PostsCollection;
});
