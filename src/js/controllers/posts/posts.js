define([
	"core/controller",
	"models/posts/collection",
	"views/posts/posts"
], function(Controller, PostsCollection, PostsView) {

	var PostsController = Controller.extend({
        initialize: function(args) {
			var self = this;
			console.log("PostsController initialize", args);
			this.collection = new PostsCollection(args);
			var $mainView = $("#main-content .main-view");
			this.view = new PostsView({
				el: $mainView,
				collection: this.collection
			});

			self.view.setLoadingIndicator();

			this.collection.fetch({reset: true}).then(
				function() {},
				function(response) {
				 	self.view.renderError(response.status, {
						message: "No posts found"
					});
				}
			).always(function() {
				self.view.removeLoadingIndicator();
			});
		}
    });

	return PostsController;
});
