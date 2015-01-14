
$(function(){

	var lock = {};

	var textbox = $('#input-search-text');

	app.method('keywords', lock, function(keywords){
		textbox.val(keywords);
	});

	textbox.blur(function(){
		app.call('keywords', lock, textbox.val());
	});

});

