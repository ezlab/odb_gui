
$(function(){

	var lock1 = {}, lock2 = {};

	var options1 = {
		'[No filtering]': '',
		'Present in all species': 1,
		'Present in >90% species': 0.9,
		'Present in >80% species': 0.8
	};

	var options2 = {
		'[No filtering]': '',
		'Single-copy in all species': 1,
		'Single-copy in >90% species': 0.9,
		'Single-copy in >80% species': 0.8
	};

	var select1 = $('#input-universal'),
		select2 = $('#input-single-copy');

	$.each(options1, function(key, value) {
		 select1.append($("<option></option>").attr("value", value).text(key));
	});

	$.each(options2, function(key, value) {
		 select2.append($("<option></option>").attr("value", value).text(key));
	});

	app.method('universal', lock1, function(value){
		select1.val(value);
	});

	app.method('singlecopy', lock2, function(value){
		select2.val(value);
	});

	select1.change(function(){
		app.call('universal', lock1, select1.val());
	});

	select2.change(function(){
		app.call('singlecopy', lock2, select2.val());
	});

});

