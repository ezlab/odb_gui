
$(function(){

	var lock = {};

	var select = $('#input-search-level');

	function calcLevels(keys){

		var i, item, results;

		function calcNode(key){

			var list = [],
				src = app.getNode(key);

			if (!src.children){
				src = src.parent;
			}

			while (src.parent){

				list.unshift({
					key: src.key,
					title: src.title
				});

				src = src.parent;
			}

			if (results){
				for (var j=0; j<results.length; j++){
					if (!list[j] || results[j].key != list[j].key){
						results.splice(j);
						break;
					}
				}
			}
			else {
				results = list;
			}
		}

		for(i=0; i<keys.length; i++){
			calcNode(keys[i]);
		}

		select.empty();

		if (results) {
			for(i=0; i<results.length; i++){
				select.append($('<option></option>').attr('value', results[i].key).html(results[i].title));
			}

			var level = results[results.length-1].key;

			select.val(level);

			app.call('setLevel', lock, level);
		}
	}


	app.method('setLevel', lock, function(level){
		select.val(level);
	});

	app.method('setSelection', lock, function(keys){
		calcLevels(keys);
	});

});

