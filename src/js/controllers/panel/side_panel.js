define([
	"jquery",
	"underscore",
	"core/controller",
	"models/posts/collection",
	"models/tags/tags",
	"views/components/search",
	"views/tags/tags",
	"views/posts/top_posts"
], function($, _, Controller, PostsModel, TagsModel, Search, TagsView, TopPosts) {
	var SidePanel = Controller.extend({
		views: {},
        initialize: function(args) {
			var componentHandlers = {
				"search": _.bind(this.initializeSearch, this),
				"sideSearch": _.bind(this.initializeSideSearch, this),
				"tags": _.bind(this.initializeTags, this),
				"topPosts": _.bind(this.initializeTopPosts, this)
			};

			this.api.event.on(
				"view/components",
				function(config) {
					console.log("CONFIG", config);
					config.forEach(function(el, idx) {
						var f = componentHandlers[el];
						if(f) {
							f();
						}
					});
				}
			);
		},
		initializeSearch: function() {
			var view = this.views.search = new Search({
				el: "#main-content .main-panel .search"
			});
			var data = {
				search: ""
			};
			view.render(data);
		},
		initializeSideSearch: function() {
			var view = this.views.sideSearch = new Search({
				el: "#main-content .side-panel .search"
			});
			var data = {
				search: ""
			};

			view.render(data);
		},
		initializeTopPosts: function() {
			var postsModel = new PostsModel();

			var view = this.views.topPosts = new TopPosts({
				el: "#main-content .side-panel .top-posts",
				collection: postsModel
			});

			postsModel.fetch({
				reset: true,
				data: $.param({
					limit: 10,
					order_by: "user_score",
					ctime_offset: 3600 * 24 * 7
				})
			});
		},

		initializeTags: function() {
			var tagsModel = new TagsModel();
			var view = this.views.topPosts = new TagsView({
				el: "#main-content .side-panel .tags",
				collection: tagsModel
			});

			tagsModel.fetch({
				reset: true,
				data: $.param({
					limit: 10
				})
			});
		}

    });

	return SidePanel;
});
