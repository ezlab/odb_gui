
$(function(){

	var lock = {};

	var textbox = $('#input-sequence');

	app.method('sequence', lock, function(sequence){
		textbox.val(sequence);
	});

	textbox.blur(function(){

		var sequence = String(textbox.val()).replace(/\W+/g, '');

		app.call('sequence', lock, sequence);
	});

});

