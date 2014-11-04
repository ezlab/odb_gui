
$(function(){

	var button = $('#submit-button');

	button.click(function(){

		var state = app.getState();

		var url = '?' + $.param({
			keywords: state.keywords,
			level: state.level,
			species: String(state.selection),
			phytoprofile: state.profile,
		});

		window.location.href = url;

	});

});

