
$(function(){

	var lock = {};

	var textbox = $('#input-search-text');

	app.method('query', lock, function(query){
		textbox.val(query);
	});

	textbox.blur(function(){
		app.call('query', lock, textbox.val());
	});

	textbox.keypress(function(e){
		if ((e.keyCode || e.which) == 13){
			app.call('query', lock, textbox.val());
		}
	});

	var level = '';

	app.method('level', lock, function(value){
		level = value;
	});

	function autocomplete(query, callback){
		$.getJSON("complete", {query: query.term, level: level}).then(app.verifyResponse).then(function(response){
			callback(response.data);
		});
	}

	textbox.autocomplete({
		minLength: 3,
		appendTo: '.s-sidebar-section-top',
		source: autocomplete
	});

});

