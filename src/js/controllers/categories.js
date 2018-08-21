define([
	"core/controller",
	"views/categories/categories",
	"models/categories/post_categories"
], function(Controller, CategoriesView, PostCategoriesModel) {
	var Index = Controller.extend({
        initialize: function(args) {
			var postCategoriesModel = new PostCategoriesModel();
			var view = new CategoriesView({
				el: "#main-content .main-view",
				model:postCategoriesModel
			});
			postCategoriesModel.fetch();
        }
    });

	return Index;
});
