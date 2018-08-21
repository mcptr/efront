define(["backbone"], function(Backbone) {
    var Categories = Backbone.Model.extend({
        url: "/api/categories/",
        initialize: function() {
		},
    });

	return Categories;
});
