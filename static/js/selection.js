
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

	options.click = function(event, data){
		if (data.targetType == 'title' && !data.node.unselectable){
			data.node.toggleSelected();
		}
	};


	var tree = $('#selection-box').fancytree(options).fancytree('getTree');


	var currentLevel, species = [];


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

		function addAllSelectedChild(parent, src){

			var node = {
				key: '@' + parent.key,
				expanded: true,
				unselectable: true,
				extraClasses: 's-unselectable',
				name: 'all ' + src.data.count + ' selected',
				allSelected: !!(src.data.examples && src.data.examples.length),
				clade: false
			}

			parent.children = [node];
		}

		function getNode(key, isParent){

			var node = nodes[key];

			if (!node){

				var src = app.getNode(key);

                if (src){
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

				    if (src.children && !isParent){
					    addAllSelectedChild(node, src);
				    }

				    nodes[key] = node;

				    if (src.parent.parent) {

					    var parent = getNode(src.parent.key, true);

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
		species = keys;
		tree.reload(makeSelectionTree(keys));
	});


	function removeSelection(key){

		var i, node, items = species.concat();

		for (i=0; i<items.length; i++){

			node = tree.getNodeByKey(items[i]);

			while (node) {
				if (node.key == key){
					items.splice(i--, 1);
					break;
				}
				node = node.parent;
			}
		}

		return items;
	}


	app.removeSelection = function(key){
		app.species(removeSelection(key.replace('@', '')));
	};


	function addExamples(items, node){

		if(node.children && node.children.length){
			$.each(node.children, function(i, node){
				addExamples(items, node);
			});
		}
		else if (node.data.examples && node.data.examples.length){
			items.push(node.key);
		}
	}


	app.useExamples = function(key){

		key = key.replace('@', '');

		var items = removeSelection(key),
			node = app.getNode(key);

		addExamples(items, node);

		app.species(items);
	};
});

