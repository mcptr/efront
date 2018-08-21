define(["backbone"], function(Backbone) {
    var PostCategories = Backbone.Model.extend({
        url: "/api/post/categories/",
        initialize: function() {
		},
    });

	return PostCategories;
});
