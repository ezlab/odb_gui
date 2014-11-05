
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


	function renderTitle(node){

		var item = node.data;

		if (node.statusNodeType){
			// skip status node
		}
		else if (!node.parent.parent){
			node.title = '<span class="tree-title-top">' + item.name + ': ' + item.count + '</span>';
		}
		else if (node.children){
			node.title = '<span class="tree-title-folder">' + item.name + ': ' + item.count + '</span> ' +
						 '<span class="tree-title-example">' + (item.example ? 'e.g. ' : '') + item.example + '</span>';
		}
		else if (item.english) {
			node.title = '<span class="tree-title-latin">' + item.latin + '</span> (' + item.english + ')';
		}
		else {
			node.title = '<span class="tree-title-latin">' + item.latin + '</span>';
		}

		return node;
	}

	options.renderTitle = function(event, data) {
		renderTitle(data.node);
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
		return renderTitle(tree.getNodeByKey(key));
	};

	app.method('species', lock, function(keys){
		$.each(keys, function(index, key){
			var node = tree.getNodeByKey(key);
			node.setSelected();
			node.setActive();
		});
	});

});
