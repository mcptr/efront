define(["backbone", "templates/posts/list"], function(Backbone, Template) {
	var PostsList = Backbone.View.extend({
		api: null,
		template: Template,
		//tagName: "div",

		id: "posts-lists",

		className: "",

		events: {
			"click a.vote": "vote"
		},
		restoreScrollPosition: true,
		initialize: function() {
			this.listenTo(this.collection, "change reset", function() {
				this.render(this.collection.toJSON());
			});
		},

		render: function(data) {
			data = (data || {});
			this.$el.empty();
			this.appendTemplate(data);
			return this;
		},

		vote: function(e) {
			var $link = $(e.target);
			var postId = $link.attr("data-id");
			var url = "/api/votes/post/" + postId;

			var data = {
				url: url
			};

			if($link.hasClass("minus")) {
				data.score = -1;
			}
			else {
				data.score = 1;
			}

			console.log("NOT IMPLEMENTED", data);
		}
	});

	return PostsList;
});
