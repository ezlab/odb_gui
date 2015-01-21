
$(function(){

	var	lock = {},
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


	function submit(){

		var cmp = [];

		$.each(params, function(name, value){
			if (value) {
				cmp.push(name + '=' + encodeURIComponent(String(value)));
			}
		});

		var url = '?' + cmp.join('&');

		app.navigate(url);
	}

	var button = $('#submit-button'),
		input = $('#input-search-text');

	button.click(submit);
	input.keypress(function(e){
		if ((e.keyCode || e.which) == 13){
			submit();
		}
	});
});

