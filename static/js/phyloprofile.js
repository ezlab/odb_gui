
$(function(){

	var lock = {};

	var options = {
		"": "Select a Phyloprofile",
		"'=1' '=1'": "Single-Copy in all species",
		"'=1' '?'": "Single-Copy, one loss or duplication",
		"'=1' '=0'": "Single-Copy, but one loss",
		"'=1' '>1'": "Single-Copy, but one >1",
		"'=1' '>2'": "Single-Copy, but one >2",
		"'=1' '>3'": "Single-Copy, but one >3",
		"'=1' '90'": "Single-Copy in >90% of species",
		"'=1' '80'": "Single-Copy in >80% of species",
		"'=1' '70'": "Single-Copy in >70% of species",
		"'>1' '>1'": "Multi-Copy in all species",
		"'>1' '?'": "Multi-Copy, one loss or single-copy",
		"'>1' '=0'": "Multi-Copy, but one loss",
		"'>1' '=1'": "Multi-Copy, but one single-copy",
		"'>1' '90'": "Multi-Copy in >90% of species",
		"'>1' '80'": "Multi-Copy in >80% of species",
		"'>1' '70'": "Multi-Copy in >70% of species",
		"'>0' '>0'": "Present in all species",
		"'>0' '=0'": "Present, but one loss",
		"'>0' '90'": "Present in >90% of species",
		"'>0' '80'": "Present in >80% of species",
		"'>0' '70'": "Present in >70% of species"
	};

	var select = $('#input-phylo-profile');

	$.each(options, function(key, value) {
		 select.append($("<option></option>").attr("value", key).text(value));
	});

	app.method('phyloprofile', lock, function(profile){
		select.val(profile);
	});

	select.change(function(){
		app.call('phyloprofile', lock, select.val());
	});
});

