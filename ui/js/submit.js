
$(function(){

	var button = $('#submit-button'),
		lock = {},
		params = {};

	app.method('setKeywords', lock, function(keywords){
		params.keywords = keywords;
	});

	app.method('setProfile', lock, function(profile){
		params.phyloprofile = profile;
	});

	app.method('setLevel', lock, function(level){
		params.level = level;
	});

	app.method('setSelection', lock, function(keys){
		params.species = String(keys);
	});


	button.click(function(){

		var cmp = [];

		$.each(params, function(name, value){
			cmp.push(name + '=' + encodeURIComponent(String(value)));
		});

		var url = '?' + cmp.join('&');

		app.navigate(url);
	});

});

