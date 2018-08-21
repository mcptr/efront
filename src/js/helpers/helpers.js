define(
	[
		"helpers/url",
		"helpers/datetime",
		"helpers/markup"
	],
	function(UrlHelper, DateTime, Markup) {

		return {
			url: UrlHelper,
			datetime: DateTime,
			markup: Markup
		};

});
