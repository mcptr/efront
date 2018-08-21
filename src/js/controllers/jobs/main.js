define([
	"core/controller",
	"models/jobs/list",
	"views/jobs/list"
], function(Controller, JobsListModel, JobsListView) {

	var Main = Controller.extend({
		initialize: function(args) {
			console.log("Jobs::Main::initialize");
			this.model = new JobsListModel();
			this.view = new JobsListView({
				el: $(".main-view"),
				model: this.model,
				api: this.api
			});

			this.view.render();
		}
	});

	return Main;
});
