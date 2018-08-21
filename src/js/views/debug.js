define(["backbone", "templates/debug"], function(Backbone, Template) {
    var Debug = Backbone.View.extend({
		api: null,
        template: Template,
        events: {},
        initialize: function (data) {
			var self = this;
			this.api = data.api;

			if(this.api) {

				this.listenTo(this.api.session, "change", function(data) {
					self.renderDefault();
				});

				this.listenTo(this.api.user, "change", function(data) {
					self.renderDefault();
				});

				this.api.event.on("debug", function(data) {
					self.render(data);
				});
			}
        },

        render: function(data, clear) {
			if(clear) {
				this.$el.empty();
			}
			return this.appendTemplate(data);
        },

		renderDefault: function() {
			var data = {
				session: this.api.session.toJSON(),
				user: this.api.user.toJSON()
			};
			this.render(data, true);
		}
    });

	return Debug;
});
