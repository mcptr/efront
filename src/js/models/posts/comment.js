define(["backbone", "core/utils"], function(Backbone, Utils) {
    var Link = Backbone.Model.extend({
		id: null,
        initialize: function(data) {
		},

		sync: function(method, model, options) {
			this.urlRoot = Utils.string.format("/api/post/{postId}/comments", {
				postId: model.get("post_id")
			});
			return Backbone.sync(method, model, options);
		},

        parse: function(response, options)  {
            return response;
        }
    });

	return Link;
});
