define(["jquery", "marked"], function($, marked) {

	var renderer = new marked.Renderer();
	renderer.link = function(href, title, text) {
		if(this.options.sanitize) {
			try {
				var prot = decodeURIComponent(unescape(href))
					.replace(/[^\w:]/g, '')
					.toLowerCase();
			} catch (e) {
				return '';
			}
			if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
				return '';
			}
		}
		var out = '<a href="' + href + '"';
		if(title) {
			out += ' title="' + title + '"';
		}
		out += ' data-bypass="">' + text + '</a>';
		return out;
	};

	renderer.image = function(href, title, text) {
		var out = '<img src="' + href + '" alt="img:' + text + '"';
		if (title) {
			out += ' title="' + title + '"';
		}
		out += this.options.xhtml ? '/>' : '>';
		return out;
	};

	marked.setOptions({
		renderer: renderer,
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: true,
		smartLists: true,
		smartypants: false
	});

	return {
		render: function(text) {
			return marked(text.replace(/((\\n\\n)|(\\n\\r)|(\\r\\n))/g, "\n\n"));
		}
	};
});
