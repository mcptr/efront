define(["momentjs"], function(momentjs) {

	function unixToUTCDateTime(tstamp, format) {
		var value = momentjs.unix(tstamp);
		return value.format(
			(format || "DD-MM-YYYY HH:mm")
		);
	}

	return {
		moment: momentjs,
		unixToUTCDateTime: unixToUTCDateTime
	};
});
