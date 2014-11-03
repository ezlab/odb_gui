
$(function(){

	var options = {
		source: []
	};

	var tree = $('#selection-box').fancytree(options).fancytree('getTree');


	function makeSelectionTree(keys){

		var i, results = [], nodes = {};

		function getNode(key){

			var node = nodes[key];

			if (!node){

				var src = app.getNode(key);

				node = {
					key: key,
					expanded: true,
					title: src.title
				};

				nodes[key] = node;

				if (src.parent.parent) {

					var parent = getNode(src.parent.key);

					if (!parent.children){
						parent.children = [];
					}

					parent.children.push(node);
				}
				else {
					results.push(node);
				}
			}

			return node;
		}

		for(i=0; i<keys.length; i++){
			getNode(keys[i]);
		}

		return results;
	}


	var setSelection = app.setSelection;

	app.setSelection = function(keys){

		setSelection(keys);

		tree.reload(makeSelectionTree(keys));
	};
});

