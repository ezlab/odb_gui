
$(function(){

	var lock = {};

	app.method('mode', lock, function(mode){

		var selected = 's-sidebar-tab-selected',
			hidden = 's-hidden';

		if (mode) { // sequence
			$('#tab-0').removeClass(selected);
			$('#tab-1').addClass(selected);

			$('#wrap-0').addClass(hidden);
			$('#wrap-1').removeClass(hidden);
		}
		else {
			$('#tab-0').addClass(selected);
			$('#tab-1').removeClass(selected);

			$('#wrap-0').removeClass(hidden);
			$('#wrap-1').addClass(hidden);
		}

	});

	app.selectTab = function(i){
		app.mode(i ? 'seq' : '');
	};
});

