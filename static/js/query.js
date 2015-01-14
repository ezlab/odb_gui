
$(function(){

	var lock = {};

	var textbox = $('#input-search-text');

	app.method('query', lock, function(query){
		textbox.val(query);
	});

	textbox.blur(function(){
		app.call('query', lock, textbox.val());
	});

});

