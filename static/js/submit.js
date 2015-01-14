
$(function(){

	var button = $('#submit-button'),
		lock = {},
		params = {};

	app.method('query', lock, function(query){
		params.query = query;
	});

	app.method('phyloprofile', lock, function(profile){
		params.phyloprofile = profile;
	});

	app.method('level', lock, function(level){
		params.level = level;
	});

	app.method('species', lock, function(keys){
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

