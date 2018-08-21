define([
	"backbone",
	"controllers/index",
	"controllers/categories",
	"controllers/posts/posts",
	"controllers/posts/post",
	"controllers/posts/new_post",
], function(Backbone, IndexCtrl, CategoriesCtrl,
			PostsCtrl, PostCtrl, NewPostCtrl) {

	var errorHandler = function() {
		Backbone.history.navigate("/", {replace: true, trigger: true});
	};

    var Main = Backbone.Router.extend({
		postDetailsHandler: function() {
			this.dispatch(PostCtrl, arguments);
		},
		mainHandler: function() {
			this.dispatch(PostsCtrl, arguments);
		},
		categoriesHandler: function() {
			this.dispatch(CategoriesCtrl, arguments);
		},
		categoryHandler: function() {
			this.dispatch(PostsCtrl, arguments);
		},
		newPostHandler: function() {
			this.dispatch(NewPostCtrl, arguments);
		},
		name: "Main",
		routes: {
			"(/)" : "mainHandler",
			"main(/)": "mainHandler",
			"new(/)": "mainHandler",
			"categories(/)": "categoriesHandler",
			"category/:id(/)*rest": "categoryHandler",
			"post(/)": "newPostHandler",
			"post/:id(/)": "postDetailsHandler",
			"*error": errorHandler
		}
    });

	return Main;
});
