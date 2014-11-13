
$(function(){

	var lock = {};

	var options = {
		source: []
	};

	options.renderTitle = function(event, data){
		if (!data.node.statusNodeType){
			data.node.title = app.templates.selection(data.node);
		}
	}

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
					name: src.data.name,
					alias: src.data.alias,
					clade: !!src.children
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


	app.method('species', lock, function(keys){
		tree.reload(makeSelectionTree(keys));
	});
});

