
$(function(){

	function ok(content){
		$("#content").html(content);
	}

	function err(xhr, status){
		$("#content").html(status);
	}

	$.get('ui/pages/intro.html').then(ok, err);

});
