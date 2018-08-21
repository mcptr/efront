define(
	["jquery"],
	function() {
		// Let's invent the wheel, but keep it on a monkey level;

		var String = {
			format: function(fmt, obj) {
				for(var k in obj) {
					fmt = fmt.replace("{" + k + "}", obj[k]);
				}

				return fmt;
			}
		};

		return String;
	}
);
