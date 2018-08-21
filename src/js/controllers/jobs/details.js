define(["core/controller"], function(Controller) {
	var Details = Controller.extend({
		initialize: function(jobId) {
			console.log("Jobs::Details::initialize", this.api, jobId);
		}
	});

	return Details;
});
