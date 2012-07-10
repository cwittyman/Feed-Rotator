/*
 * 
 */
 
// jgFeed 
(function($){
  $.extend({
    jGFeed : function(url, fnk, num, key){
      // Make sure url to get is defined
      if(url == null) return false;
      // Build Google Feed API URL
      var gurl = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q="+url;
      if(num != null) gurl += "&num="+num;
      if(key != null) gurl += "&key="+key;
      // AJAX request the API
      $.getJSON(gurl, function(data){
        if(typeof fnk == 'function')
          fnk.call(this, data.responseData.feed);
        else
          return false;
      });
    }
  });
})(jQuery);


(function($) {
	$(function() {

		$.fn.feedRotator = function(options) {
			var $me = this;
			var defaults = {
				fetchData: false,				// Should we use what's there, or empty it and use a URL?
				feedUrl: '',					// XML Feed URL
				dataType: 'jsonp',				// 'xml', 'json', 'jsonp', 'script', 'html'
				useStaticTitle: false,
				feedTitle: 'Title',				// XML Item to use as "Title"
				staticTitle: '',				// Static Title, instead of using a value from the feed
				feedContent: 'Content',			// XML Item to use as "Content"
				smartBrief: true,
				smartBriefUrl: 'http://www.smartbrief.com/servlet/rss?b=cea',

				itemClass: '.newsfeed-item',
				titleClass: '.title',
				contentClass: '.content',
				currentItem: 'visible-item',
				lineHeight: 20,
				parentHeight: 25,
				waitTime: 5000,					// in ms, time in between durations
				transitionTime: 2000,			// in ms, duration of the transition
				easing: 'linear',
				autoRotateDirection: 'up'		// 'up' or 'down'
			}
			var options = $.extend(defaults, options);
			
			var urlsToLinks = function(text) {
				text = $("<p>"+text+"</p>").text();
			    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			    return text.replace(exp,"<a target='_blank' href='$1'> Read More</a>"); 
			}
			
			// Do something if fetchData!
			if (options.fetchData) {
				$.getJSON(options.feedUrl, function(data) {
					var outputContent = '';
					var outputContent = '';
					for (msgNum in data) {
						var itemTitle, itemContent;
						for (var key in data[msgNum]) {
							if (data[msgNum].hasOwnProperty(key)) {
								if (key == options.feedContent) {
									itemContent = data[msgNum][key];
								} else if (key == options.feedTitle) {
									itemTitle = data[msgNum][key];
								} else if (data[msgNum][key] == null) {
									continue;
								} else if (data[msgNum][key].hasOwnProperty(options.feedContent)) {
									itemContent = data[msgNum][key][options.feedContent];
								} else if (data[msgNum][key].hasOwnProperty(options.feedTitle)) {
									itemTitle = data[msgNum][key][options.feedTitle];
								}
							}
						}
						if (options.useStaticTitle) {
							itemTitle = options.staticTitle;
						}
						outputContent += '<div class="'+options.itemClass.substr(1)+'">' +
								'<span class="'+options.titleClass.substr(1)+'">'+itemTitle+'</span>'+
								'<span class="'+options.contentClass.substr(1)+'">'+urlsToLinks(itemContent)+'</span>'+
							'</div>';
					}
					// Set the new content and restart the feedRotator, with "fetchData" set to false.
					$me.html(outputContent).feedRotator($.extend(options, {fetchData: false}));
				});
				return this;
			} else {
				this.find(options.contentClass).each(function() {
					$(this).html(urlsToLinks($(this).html()));
				});
			}
			
			//If Smart Brief
			if(options.smartBrief){
				$.jGFeed(options.smartBriefUrl,
					function(feeds){
					// Check for errors
					if(!feeds){
						// there was an error
						return false;
					}
					var str = "";
					for(var i = 0; i<feeds.entries.length;i++)
					{
						var link = "<a href='" +feeds.entries[i].link + "' target='_blank'> Read More</a>";
						str += '<div class="newsfeed-item"><span class="title">';
						str += 'CEA SmartBrief';
						str += '</span><span class="content">';
						str += $.trim(feeds.entries[i].title).replace(/�/g,' ') + " ... " + feeds.entries[i].link;
						//.substring(0, 100).split(" ").slice(0, -1).join(" ") 
						str += '</span></div>';
									
						
					}
					// Set the new content and restart the feedRotator, with "smartBrief" set to false.
					$me.html(str).feedRotator($.extend(options, {smartBrief: false}));
	
				},15); 			
			}
			
			// If no items, stop. If only one, duplicate it so it scrolls well.
			if (this.find(options.itemClass).length < 1) {
				return this;
			} else if (this.find(options.itemClass).length == 1) {
				this.append(this.find(options.itemClass).clone());
			}
			
			// Set initial parent height and overflow, so it displays nicely.
			this.css({
				'overflow': 'hidden',
				'position': 'relative',			// IE7 fix.
				'height': options.parentHeight+'px'
			});
			if (options.autoRotateDirection == 'up') {
				// Set all items and their content to position: relative, top: 0.
				this.find(options.itemClass)
					.removeClass(options.currentItem)
					.css({
						'position': 'relative',
						'top': '0px'
					})
					.eq(0).addClass(options.currentItem);
				this.find(options.contentClass).css({
						'position': 'relative',
						'top': '0px'
					});
			} else {
				// Set all items and their content to position: relative, top: -height.
				this.find(options.itemClass)
					.removeClass(options.currentItem)
					.css({
						'position': 'relative',
						'top': '-'+options.parentHeight+'px'
					})
					.eq(1).addClass(options.currentItem);
				this.find(options.contentClass).css({
						'position': 'relative',
						'top': '0px'
					});
			}
			
			// Movement function - rotates to the next item down.
			this.rotateUp = function() {
				var cParent, cItem, cItemPosition, nParent, nPHeight, nItem, nPosition;
				cParent = $me.find('.'+options.currentItem);
				cItem = cParent.find(options.contentClass);
				cItemHeight = cItem.height();
				cItemPosition = parseInt(cItem.css('top'));
				
				if ((cItemHeight+cItemPosition-options.lineHeight) <= 0) {
					if (cParent.next().length > 0) {
						nParent = cParent.next();
					} else {
						nParent = $me.find(options.itemClass).eq(0);
					}
					
					cParent.removeClass(options.currentItem);
					nParent.addClass(options.currentItem);
					$me.find(options.itemClass).animate({
							'top': '-'+options.parentHeight+'px'
						}, options.transitionTime, options.easing, function() {
							cItem.css({'top': '0px'});
							$me.append(cParent);
							$me.find(options.itemClass).css({'top': '0px'});
						});
				} else {
					cItem.animate({
						'top': (cItemPosition-options.lineHeight)+'px'
					}, options.transitionTime, options.easing);
				}
				
				clearTimeout($me.slideTimer);
				$me.slideTimer = null;
				$me.slideTimer = setTimeout(function() { $me.rotateUp(); }, options.waitTime+options.transitionTime);
				
				return true;
			}
			
			// Movement function - rotates to the next item up.
			this.rotateDown = function() {
				var cParent, cItem, cItemPosition, nParent, nPHeight, nItem, nPosition;
				cParent = $me.find('.'+options.currentItem);
				cItem = cParent.find(options.contentClass);
				cItemHeight = cItem.height();
				cItemPosition = parseInt(cItem.css('top'));
				
				if ((cItemHeight+cItemPosition-options.lineHeight) <= 0) {
					if (cParent.next().length > 0) {
						nParent = cParent.next();
					} else {
						nParent = $me.find(options.itemClass).eq(0);
					}
					
					cParent.removeClass(options.currentItem);
					nParent.addClass(options.currentItem);
					$me.find(options.itemClass).animate({
							'top': '0px'
						}, options.transitionTime, options.easing, function() {
							cItem.css({'top': '0px'});
							$me.prepend(cParent);
							$me.find(options.itemClass).css({'top': '-'+options.parentHeight+'px'});
						});
				} else {
					cItem.animate({
						'top': (cItemPosition-options.lineHeight)+'px'
					}, options.transitionTime, options.easing);
				}
				
				clearTimeout($me.slideTimer);
				$me.slideTimer = null;
				$me.slideTimer = setTimeout(function() { $me.rotateDown(); }, options.waitTime+options.transitionTime);
				
				return true;
			}
			
			// Define initial slide timer, so it auto slides on page load.
			this.slideTimer = setTimeout(function() {
					if (options.autoRotateDirection == 'down') {
						$me.rotateDown();
					} else {
						$me.rotateUp();
					}
				}, options.waitTime);
			
			// Pause on hover. Restart timer when mouse leaves the area.
			this.hover(function() {
				clearTimeout($me.slideTimer);
				$me.slideTimer = null;
			}, function() {
				$me.slideTimer = setTimeout(function() {
					if (options.autoRotateDirection == 'down') {
						$me.rotateDown();
					} else {
						$me.rotateUp();
					}
				}, options.waitTime+options.transitionTime);
			});
			
			// Wrap it up!
			return this;
		}

	});
	
})(jQuery);
