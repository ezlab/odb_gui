
$(function(){

	var lock = {};

	var options = {
		source: [],
		icons: false,
		checkbox: true,
		selectMode: 1
	};

	options.renderTitle = function(event, data){
		if (!data.node.statusNodeType){
			data.node.title = app.templates.selection(data.node);
		}
	};

	options.select = function(event, data){
		if (data.node.selected){
			app.call('level', lock, data.node.key);
		}
	};


	var tree = $('#selection-box').fancytree(options).fancytree('getTree');


	var currentLevel;


	function makeChildrenUnselectable(node){
		$.each(node.children, function(i, node){
			node.unselectable = true;
			node.extraClasses = 's-unselectable';
			if (node.children){
				makeChildrenUnselectable(node);
			}
		});
	}

	function makeSelectionTree(keys){

		var i, results = [], nodes = {};

		function getNode(key){

			var node = nodes[key];

			if (!node){

				var src = app.getNode(key);

				node = {
					key: key,
					selected: key == currentLevel,
					expanded: true,
					unselectable: !src.children,
					extraClasses: src.children ? '' : 's-unselectable',
					name: src.data.name,
					alias: src.data.alias,
					clade: !!src.children
				};

				nodes[key] = node;

				if (src.parent.parent) {

					var parent = getNode(src.parent.key);

					if (parent.children){
						parent.children.push(node);
						makeChildrenUnselectable(parent);
					}
					else {
						parent.children = [node];
						if (parent.unselectable) {
							makeChildrenUnselectable(parent);
						}
					}
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

	app.method('level', lock, function(level){

		currentLevel = level;

		var node = tree.getNodeByKey(level);

		if (node && !node.selected){
			node.setSelected(true);
		}
	});

	app.method('species', lock, function(keys){
		tree.reload(makeSelectionTree(keys));
	});
});

