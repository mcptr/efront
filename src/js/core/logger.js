define([], function() {
	function Logger(loggerName, api) {
		var name = loggerName;
		var instances = {};

		var log = function(lvl, msg, data) {
			//TODO: ajax log
			var t = new Date().getTime();

			var logData = data;

			if(api) {
				logData = {
					data: data,
					session_id: api.session.get("id"),
					user: api.user.toJSON()
				};
			};

			console.log("[" + name + "]", t, msg, logData);
		};
		
		this.error = function(msg, data) {
			log("ERROR", msg, data);
		};
		
		this.log = function(msg, data) {
			log("LOG", msg, data);
		};

		this.getLogger = function(name) {
			if(!instances[name]) {
				instances[name] = new Logger(name, api);
			}
			return instances[name];
		};
	};

	return Logger;
});
