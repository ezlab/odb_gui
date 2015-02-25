
$(function(){

	var lock = {};

	var textbox = $('#input-sequence');

	app.method('sequence', lock, function(sequence){
		textbox.val(sequence);
	});

	textbox.blur(function(){
		app.call('sequence', lock, textbox.val());
	});

});

