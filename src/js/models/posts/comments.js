define(["backbone", "core/utils", "models/posts/comment"], function(Backbone, Utils, CommentModel) {

    var CommentsCollection = Backbone.Collection.extend({
		model: CommentModel,
		postId: null,
        initialize: function(postId) {
			console.log("POST ID", postId);
			this.postId = postId;
			this.url = Utils.string.format("/api/post/{postId}/comments", {
				postId: postId
			});
		},

        parse: function(response, options)  {
            return response.comments;
        }
    });

	return CommentsCollection;
});
