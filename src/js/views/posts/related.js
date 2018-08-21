define(["backbone", "templates/posts/related"], function(Backbone, Template) {
    var RelatedPosts = Backbone.View.extend({
		api: null,
        template: Template,
        events: {},

        initialize: function(data) {
        },

        render: function() {
			this.$el.empty();
			return this.appendTemplate({});
        }

    });

	return RelatedPosts;
});
