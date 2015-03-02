
$(function(){

	var visited = $.cookie('visited');

	if (visited){
		return;
	}

	$.cookie('visited', true, { expires: 90 });

	var overlay = $('#overlay');

	overlay.removeClass('s-hidden');

	overlay.click(function(){
		overlay.addClass('s-hidden');
	});
});

