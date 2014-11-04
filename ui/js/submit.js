
$(function(){

	var button = $('#submit-button');

	button.click(function(){

		var cmp = [],
			state = app.getState();

		var params = {
			keywords: state.keywords,
			level: state.level,
			species: String(state.selection),
			phyloprofile: state.profile,
		};

		$.each(params, function(name, value){
			if (value) {
				cmp.push(name + '=' + encodeURIComponent(String(value)));
			}
		});

		var url = '?' + cmp.join('&');

		window.location.href = url;

	});

});

