define(["backbone", "templates/categories/categories"], function(Backbone, Template) {
    var CategoriesView = Backbone.View.extend({
		api: null,
        template: Template,
        className: "",
        events: {},
        initialize: function(data) {
			var self = this;
			this.listenTo(this.model, "sync change reset", function(data) {
				self.render(data.attributes);
			});
        },

        render: function(data) {
			this.$el.empty();
			return this.prependTemplate(data);
        }

    });

	return CategoriesView;
});
