define(["backbone", "templates/nav/navbar-top"], function(Backbone, Template) {
    var NavbarTop = Backbone.View.extend({
		api: null,
		template: Template,
        tagName: "div",

        id: "",

        className: "",

        events: {
		},

        initialize: function(data) {
        },

        render: function(data) {
			data = (data || {});
			this.$el.empty();
			this.appendTemplate(data);
        },
		setActive: function(fragment) {
			fragment = (
				fragment[fragment.length - 1] == "/"
					? fragment : fragment + "/"
			);
			this.$el.find("li.active").removeClass("active");
			var selector = "li a[href='/" + fragment + "']";
			this.$el.find(selector).parent().addClass("active");
		}
    });

	return NavbarTop;
});
