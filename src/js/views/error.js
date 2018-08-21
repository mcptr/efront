define(["backbone", "templates/error"], function(Backbone, Template) {
    var Error = Backbone.View.extend({
		api: null,
        template: Template,
        className: "",
        events: {},
		replace: false,
        initialize: function(data) {
			this.replace = (data.replace || this.replace);
        },

        render: function(data) {
			data = (data || {});
			data.className = this.className;
			if(data.replace) {
				this.$el.empty();
			}
			if(data.details && typeof data.details !== "Array") {
				data.details = [ data.details ];
			}
			return this.prependTemplate(data);
        }

    });

	return Error;
});
