define(["backbone", "templates/posts/top_posts"], function(Backbone, Template) {
    var PopularPosts = Backbone.View.extend({
		api: null,
        template: Template,

        tagName: "div",

        id: "",

        className: "",

        events: {},

        initialize: function(data) {
			this.listenTo(this.collection, "change reset", function() {
				this.render(this.collection.toJSON());
			});
        },

        render: function(data) {
			data = (data || {});
			this.$el.empty();
			return this.appendTemplate(data);
        }

    });

	return PopularPosts;
});
