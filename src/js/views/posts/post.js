define(
	[
		"backbone",
		"templates/posts/post",
	],
	function(Backbone, Template) {
		var Post = Backbone.View.extend({
			api: null,
			template: Template,
			id: "",
			className: "",
			events: {
				"click a.vote": "vote"
			},

			initialize: function(data) {
				this.listenTo(this.model, "change add remove", function() {
					this.render(this.model.toJSON());
				});
			},

			render: function(data) {
				this.$el.empty();
				this.appendTemplate(data);
			},
		});

		return Post;
	}
);
