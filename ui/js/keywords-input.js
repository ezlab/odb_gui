
$(function(){

	var lock = {};

	var textbox = $('#input-search-text');

	app.method('setKeywords', lock, function(keywords){
		textbox.val(keywords);
	});

	textbox.blur(function(){
		app.call('setKeywords', lock, textbox.val());
	});

});

