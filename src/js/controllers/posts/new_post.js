define([
	"underscore",
	"core/controller",
	"models/posts/post",
	"views/posts/post_form"
], function(_, Controller, PostModel, NewPostView) {

	var NewPost = Controller.extend({
		viewComponents: [],
		initialize: function(id) {
			var self = this;

			this.postModel = new PostModel();
			var $mainView = $("#main-content .main-view");

			this.view = new NewPostView({
				el: $mainView,
				model: this.postModel,
			});

			this.view.render();
		},
    });

	return NewPost;
});
