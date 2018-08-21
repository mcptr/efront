define(["backbone"], function(Backbone) {
    var Channels = Backbone.Model.extend({
        url: "/api/channels/",
        initialize: function() {
		},
    });

	return Channel;
});
