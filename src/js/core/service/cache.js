define(
	[],
	function() {

		function Cache() {
			var cache = {};

			this.set = function(key, value) {
				cache[key] = value;
			};

			this.get = function(key, defaultValue) {
				return (cache[key] || defaultValue);
			};
		
			this.remove = function(key, value) {
				delete cache[key];
			}

			this.getCache = function() {
				return cache;
			};
		};

		return Cache;
});
