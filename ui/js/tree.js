
$(function(){

	var lock = {};

	var source = {
		url: "data/tree.json",
		cache: true
	};

	// see list of options at
	// http://www.wwwendt.de/tech/fancytree/doc/jsdoc/global.html#FancytreeOptions
	var options = {
		source: source,
		icons: false,
		checkbox: true,
		selectMode: 3
	};

	options.postProcess = function(event, data){

		var response = data.response;

		if (response.status == 'ok'){
			data.result = response.data;
			app.init();
		}
		else {
			data.result = {
				error: 'Server error'
			};
		}
	};

	options.defaultKey = function(node){
		return node.data.id;
	};

	options.renderTitle = function(event, data) {
		if (!data.node.statusNodeType){
			data.node.title = app.templates.tree(data.node);
		}
	};

	options.select = function(event, data){

		var i, selection = [], nodes = data.tree.getSelectedNodes(true);

		for (i=0; i<nodes.length; i++){
			selection.push(nodes[i].key);
		}

		app.call('species', lock, selection);
	};


	// creating the tree component
	var tree = $("#full-tree").fancytree(options).fancytree("getTree");

	app.getNode = function(key){
		return tree.getNodeByKey(key);
	};

	app.method('species', lock, function(keys){

		var nodes = tree.getSelectedNodes(true),
			selection = {};

		$.each(keys, function(index, key){
			selection[key] = true;
		});

		var nodes = tree.getSelectedNodes(true);

		$.each(nodes, function(index, node){
			if (!selection[node.key]){
				node.setSelected(false);
			}
		});

		$.each(keys, function(index, key){
			var node = tree.getNodeByKey(key);
			if (!node.selected){
				node.setSelected();
				node.setActive();
			}
		});
	});

});
