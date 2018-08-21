define([], function() {
	// Sooner or later this one will explode, I know.
	var urlRE = /^((\w+)(\:\/\/)+)?([^\/]+)(.*)?$/;

	function parseQueryString(qs, sep) {
		if(!qs.length) {
			return {};
		}

		var params = {};
		var pairs = qs.split((sep || "&"));
		pairs.forEach(function(el, idx) {
			var pair = el.split("=");
			if(pair[0].length) {
				params[pair[0]] = pair[1];
			}
		});

		return params;
	}

	function parse(url) {
		url = (url || "");
		var proto = null;
		var domain = null;
		var path = null;
		var query = null;
		var params = null;

		var parts = (url.split(urlRE) || []);
		if(parts.length) {
			parts.pop();
			path = parts.pop();
			domain = parts.pop();
			parts.pop();
			proto = parts.pop();
		}

		if(path && path.indexOf("?")) {
			var parts = path.split("?");
			path = parts.shift();
			query = parts.join("");
			params = parseQueryString(query);
		}

		var result = {
			domain: domain,
			proto: proto,
			path: path,
			queryString: query
		};

		if(params) {
			result.params = params;
		}

		return result;
	}

	function getDomain(url) {
		return parse(url).domain;
	}

	function getProtocol(url) {
		return parse(url).proto;
	}

	return {
		parse: parse,
		parseQueryString: parseQueryString,
		getDomain: getDomain,
		getProtocol: getProtocol
	};

});
