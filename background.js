function navigate(url) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.update(tab.id, {url: url});
	});
}

chrome.omnibox.onInputEntered.addListener(function(text) {
	navigate('http://www.google.com/search?q=' + text + '+yelp&btnI=Im+Feeling+Lucky');
});
