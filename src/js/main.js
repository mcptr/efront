require.config({
	paths: {
		js: "/js",
		css: "/css",

		backbone: "vendor/backbone",
		bootstrap: "vendor/bootstrap.min",
		jquery: "vendor/jquery",
		"jquery-textrange": "vendor/jquery-textrange",
		"jquery-form": "vendor/jquery.form",
		//"animo": "vendor/animo.js/animo.min",
		underscore: "vendor/underscore-min",
		urijs: "vendor/URI.min",
		marked: "vendor/marked.min",
		momentjs: "vendor/moment.min",
		selectize: "vendor/selectize.min"
	},
	shim: {
		backbone: { deps: ["jquery", "underscore"] },
		bootstrap: { deps: ["jquery"] },
		"jquery-textrange": { deps: ["jquery"] },
		"jquery-form": { deps: ["jquery"] }
		//"animo": { deps: ["jquery"] }
	},
	stubModules: ['doTCompiler', 'text', 'doT']
});

require(
	[
		"jquery",
		"bootstrap",
		"app",
		"plugins",
	],
	function($, Bootstrap, App, Plugins) {
		App.init();
		App.logging.log("Initialized");
		
		$(document).ready(function () {
			App.start();
			App.logging.log("Started");
		});
	}
);
