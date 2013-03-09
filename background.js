var lat, lon;
var ywsid = 'ItBMRL7X54oxzHFqiQddRQ';
var suggestTimeout;

navigator.geolocation.getCurrentPosition(
	function(geo) {
		lat = geo.coords.latitude;
		lon = geo.coords.longitude;
	}
);

chrome.omnibox.setDefaultSuggestion({
	description: 'I’m Feeling Yelpy: %s'
});

chrome.omnibox.onInputEntered.addListener(function(text) {
	if ( text.indexOf('http') === 0 ) {
		url = text;
	} else {
		url = 'http://www.google.com/search?q=' + text + '+yelp&btnI=Im+Feeling+Lucky';
	}
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.update(tab.id, { url: url });
	});
});

// search suggestions
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
	if ( text.length < 3 ) {
		return;
	}
	if ( suggestTimeout ) {
		clearTimeout( suggestTimeout );
	}
	// assume the user's done typing after 500 seconds
	var timeout_duration = 500;
	suggestTimeout = setTimeout(
		function() {
			$.get(
				'http://api.yelp.com/business_review_search',
				{
					'term':   text,
					'lat':    lat,
					'long':   lon,
					'radius': 10,
					'limit':  5,
					'ywsid':  ywsid
				},
				function(data) {
					var suggestions = $.map(data.businesses, function(biz, index) {
						return {
							content: biz.url,
							description: biz.name.replace('&', '&amp;') + ' <url>' + biz.url + '</url>'
						};
					});
					suggest( suggestions );
				},
				'json'
			);
		},
		timeout_duration
	);
});
