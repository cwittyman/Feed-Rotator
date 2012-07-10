Feed Rotator
==================================================

This jQuery plugin was written to allow a Slide effect for elements from both the left and right at the same time (half of the elements slide out/in from the left, the other half from the right).


An in-depth explanation of all plugin options and their defaults is included in the index.html.

The index.html file also includes a working demo of the plugin.


Requirements
--------------------------------------
This plugin was developed on jQuery 1.7.1. Other versions may work, but have not been tested!


Basic Usage
--------------------------------------
To initialize the slider with the default options, simply run the following function on the div containing your slider elements.
```js
$('#basic-feed').feedRotator();
```

The default options are:
```js
var defaults = {
	fetchData: false,				// Should we use what's there, or empty it and use a URL?
	feedUrl: '',					// XML Feed URL
	dataType: 'jsonp',				// 'xml', 'json', 'jsonp', 'script', 'html'
	useStaticTitle: false,			// Ignore Feed Data and use "staticTitle" field.
	feedTitle: 'title',				// XML Item to use as "Title" - Ignored if useStaticTitle = true
	staticTitle: '',				// Static Title, instead of using a value from the feed
	feedContent: 'summary',			// XML Item to use as "Content"

	itemClass: '.newsfeed-item',	// CSS Class for each data row's container
	titleClass: '.title',			// CSS Class for each row's title
	contentClass: '.feed-content',	// CSS Class for each row's content text
	currentItem: 'visible-item',	// CSS Class assigned to the current visible news row
	lineHeight: 20,					// Text line-height, adjusted to make sure only one line is visible at a time
	parentHeight: 25,				// Container height, used in rotation effect
	waitTime: 5000,					// in ms, time in between durations
	transitionTime: 2000,			// in ms, duration of the transition
	easing: 'linear',
	autoRotateDirection: 'up'		// 'up' or 'down'
}
```

Advanced Usage
--------------------------------------
Storing the feed as a variable can allow for calling some additional functions.
```js
basicNewsFeed = $('#basic-feed').feedRotator({
	fetchData: true,
	feedUrl: 'http://feeds.feedburner.com/jQueryHowto',
	dataType: 'xml',
	feedContent: 'contentSnippet'
});
```

The plugin provides the ability to programatically simulate clicking on the left / right arrows:
```js
basicNewsFeed.rotateUp();		// Rotates the text up, out of the frame.
basicNewsFeed.rotateDown();		// Rotates the text down, out of the frame.
```
