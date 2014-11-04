
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

			var key, title;

			for(i=0; i<results.length; i++){
				key = results[i].key;
				title = app.getNode(key).title;
				select.append($('<option></option>').attr('value', key).html(title));
			}

			select.val(key);

			app.call('setLevel', lock, key);
		}
	}


	app.method('setLevel', lock, function(level){
		select.val(level);
	});

	app.method('setSelection', lock, function(keys){
		calcLevels(keys);
	});

});

