/**
 * jQuery FeedReader Plugin
 *
 * Copyright 2012 mon_sat <http://www.direct-search.jp/>
 *
 * Version: 1.0.0 (03/24/2012) by mon_sat
 * Requires: jQuery v1.7+
 * Requires: 
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.opensource.org/licenses/GPL-3.0
 *
 */
!function( $ ){
	var FeedReader = function ( element, options ) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.feedReader.defaults, options);
		// load feed
		var feed = new google.feeds.Feed( this.options.url );
		feed.setNumEntries( this.options.numEntries );
		feed.load( $.proxy(this, 'afterLoad') );
	}

	FeedReader.prototype = {
		constructor: FeedReader
		, afterLoad: function (result) {
			this.setRequired(result);
			this.$element.trigger('loaded', [result, this.options.data]);
			return this;
		}
		, setRequired: function(result) {
			var self = this;
			$.each(this.options.required.feed, function(key, val) {
				self._setRequired(key, val, result.feed);
			});
			$.each(this.options.required.entry, function(key, val) {
				self._setRequired(key, val, result.feed.entries);
			});
		}
		, _setRequired: function(key, val, feed) {
			if ($.isArray(feed)) {
				var self = this;
				$.map(feed, function(entry){
					return self._setRequired(key, val, entry);
				});
				return false;
			}
			if (!feed[key]) {
				feed[key] = val || '';
			}
		}
	}

	/* PLUGIN DEFINITION
	 * =========================== */
	$.fn.feedReader = function ( option ) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('feedReader');
			var options = typeof option == 'object' && option;
			if (!data) {
				$this.data('feedReader', (data = new FeedReader(this, options)));
			}
			if (typeof option == 'string') {
				data[option]();
			}
		});
	}
	// default options
	$.fn.feedReader.defaults = {
		url: '',
		numEntries: 4,
		required: {
			feed: {
				title: '',
				description: ''
			},
			entry: {
				title: '',
				description: ''
			}
		}
	};
	// construct
	$.fn.feedReader.Constructor = FeedReader;

	/* DATA-API
	 * ================== */
	$(function () {
		$('body').on('focus.feedReader.data-api', '[data-provide="feedReader"]', function (e) {
			var $this = $(this);
			var option = $this.data() ? 'defaultMethod' : $this.data(); // or option = $this.data();
			e.preventDefault();
			$this.feedReader(option);
		});
	});

}( window.jQuery );

google.load("feeds", "1");
