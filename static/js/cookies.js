
(function(){

	var saved,
		lock = {},
		options = { expires: 90 };

	app.method('universal', lock, function(value){
		saved = true;
		$.cookie('universal', value, options);
	});

	app.method('singlecopy', lock, function(value){
		saved = true;
		$.cookie('singlecopy', value, options);
	});

	app.method('species', lock, function(keys){
		saved = true;
		$.cookie('species', keys, options);
	});

	app.method('level', lock, function(value){
		saved = true;
		$.cookie('level', value, options);
	});


	app.readCookies = function(){

		if (saved){
			return;
		}

		var cookie = $.cookie();

		if (cookie.universal){
			app.call('universal', lock, cookie.universal);
		}

		if (cookie.singlecopy){
			app.call('singlecopy', lock, cookie.singlecopy);
		}

		if (cookie.species){
			app.call('species', lock, cookie.species.split(','));
		}

		if (cookie.level){
			app.call('level', lock, cookie.level);
		}
	};

})();

