define(["backbone", "templates/nav/top"], function(Backbone, Template) {
    var List = Backbone.View.extend({
		api: null,
		template: Template,
        tagName: "div",

        id: "",

        className: "",

        events: {
			"click a.navbar-brand" : function() { this.setActiveNav(null); },
			"click .nav li a" : "setActiveNav"
		},

        initialize: function (data) {
        },

        render: function (data) {
			data = (data || {});
			this.$el.empty();
			this.appendTemplate(data);
			var currentRoute = "a[href='" + data.currentRoute + "']";
			this.$el.find(currentRoute).parent().addClass("active");
        },
		setActiveNav: function(e) {
			this.$el.find("li.active a").parent().removeClass("active");
			if(e) {
				$(e.target).parent().addClass("active");
			}
		}

    });

	return List;
});
