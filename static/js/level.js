
$(function(){

	var lock = {};

	var select = $('#input-search-level');

	function calcLevels(keys){

		var i, item, results;

		function calcNode(key){

			var list = [],
				src = app.getNode(key);

            if (src){
			    if (!src.children){
				    src = src.parent;
			    }

			    while (src.parent){

				    list.unshift({
					    key: src.key,
					    name: src.data.name
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
        }

		for(i=0; i<keys.length; i++){
			calcNode(keys[i]);
		}

		select.empty();

		if (results) {

			var key, name;

			for(i=0; i<results.length; i++){
				key = results[i].key;
				name = results[i].name;
				select.append($('<option></option>').attr('value', key).html(name));
			}

			select.val(key);

			app.call('level', lock, key);
		}
		else {
			app.call('level', lock, '');
		}
	}

	select.change(function(){
		app.call('level', lock, select.val());
	});

	app.method('level', lock, function(level){
		select.val(level);
	});

	app.method('species', lock, function(keys){
		calcLevels(keys);
	});

});

