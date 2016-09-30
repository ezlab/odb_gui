
$(function(){

	var lock = {};

	var treeData = $.getJSON("tree").then(app.verifyResponse);

	// see list of options at
	// http://www.wwwendt.de/tech/fancytree/doc/jsdoc/global.html#FancytreeOptions
	var options = {
		source: [],
		icons: false,
		checkbox: true,
		selectMode: 3
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

		var el = $("#full-tree"),
			top1 = el.position().top;

		app.call('species', lock, selection);

		var top2 = el.position().top,
			sidebar = $('.s-sidebar'),
			scroll = sidebar.scrollTop();

		// restore vertical position of the tree box
		sidebar.scrollTop(scroll + top2 - top1);
	};

	options.click = function(event, data){
		if (data.targetType == 'title'){
			if (data.node.children){
				data.node.toggleExpanded();
			}
			else {
				data.node.toggleSelected();
			}
		}
	};

	// creating the tree component
	var tree = $("#full-tree").fancytree(options).fancytree("getTree");

	app.getNode = function(key){
		return tree.getNodeByKey(String(key));
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
			var node = tree.getNodeByKey(String(key));
			if (!node.selected){
				node.setSelected();
				node.setActive();
			}
		});
	});


	$.when(treeData, app.ready).then(function(response){
		tree.reload(response.data);
		app.init();
	});

	var searchBox = $('#input-tree-lookup');

	searchBox.keypress(function(e){

		if ((e.keyCode || e.which) != 13){
			return;
		}

		var s = String(this.value);

		s = s.replace(/[^\w*,]+/g, ' ');
		s = s.replace(/^\s+/, '');
		s = s.replace(/\s+$/, '');
		s = s.replace(/\*/g, '\\w*');
		s = s.replace(/\s*,\s*/g, '\\b|\\b');

		var re = new RegExp('\\b' + s + '\\b', 'i'),
			count = 0;

		function fn(node){

			if (re.test(node.data.name) || re.test(node.data.alias)){
				node.setSelected(true);
				node.setActive(true);
				++count;
			}

			if (count >= 20){
				return false; // interupt search if more than 20 nodes found
			}
		}

		tree.visit(fn);

		if (count > 0){
			this.value = ''; // clear search box if found something
		}
	});


	searchBox.on('autocompleteclose', function(){

		var s = String(this.value);

		if (!lookup[s]){
			return;
		}

		var node = tree.getNodeByKey(lookup[s]);

		if (node && !node.selected){
			node.setSelected();
			node.setActive();
		}

		this.value = '';
	});

	var lookup = {};

	function autocomplete(request, response){

		var re = new RegExp('\\b' + $.ui.autocomplete.escapeRegex(request.term), 'i'),
			items = [];

		lookup = {};

		tree.visit(function(node){

			if (re.test(node.data.name) || re.test(node.data.alias)){

				var item = node.data.name + (node.data.alias ? ' (' + node.data.alias + ')' : '');

				items.push(item);
				lookup[item] = node.key;
			}

			if (items.length >= 20){
				return false;
			}
		});

		response(items);
	}

	searchBox.autocomplete({
		appendTo: '.s-sidebar-section-top',
		source: autocomplete
	});


	app.extractSpecies = function(items, max){

		var species = [];

		function extract(items){

			var i, item, node;

			for(i=0; i<items.length; i++){

				item = items[i];

				if (item.key) {
					item = item.key;
				}

				node = app.getNode(item);

				if (!node){
					break;
				}

				if (node.children){
					extract(node.children);
				}
				else {
					species.push(item);
				}

				if (species.length > max){
					return;
				}
			}
		}

		extract(items);

		return species;
	};

});
