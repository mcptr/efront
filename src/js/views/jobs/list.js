define(["backbone", "templates/jobs/list"], function(Backbone, Template) {
    var List = Backbone.View.extend({
		api: null,
        template: Template,

        tagName: "div",

        id: "",

        className: "",

        events: {},

        initialize: function (data) {
			this.api = data.api;
        },

        render: function () {
			this.$el.empty();
			return this.appendTemplate({});
        }

    });

	return List;
});
