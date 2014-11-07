
$(function(){

	var templates = ['group', 'summary'],
		partials = ['gene_onthologies'];

	function path(name){
		return 'ui/templates/' + name + '.html';
	}

	var totalCount = 0,
		searchResults = [],
		groups = {},
		tpl = {},
		ready;

	function takeFirstArgument(value){
		return value;
	}

	function load(url){
		return $.get(url).then(takeFirstArgument);
	}


	function compileTemplate(name, source){
		tpl[name] = Handlebars.compile(source);
	}

	function registerPartial(name, source){
		Handlebars.registerPartial(name, source);
	}

	$.each(partials, function(index, name){
		ready = $.when(name, load(path(name)), ready).then(registerPartial);
	});

	$.each(templates, function(index, name){
		ready = $.when(name, load(path(name)), ready).then(compileTemplate);
	});


	function renderGroup(data, id){
		$('#content').html(tpl.group(data));
	}


	function processGroupData(response){
			var group = response.data, id = group.id;
			groups[id] = group;
			renderGroup(group, id);
	}


	function sendGroupRequest(i){
		$.getJSON('data/group.json', {id:searchResults[i]}).then(processGroupData);
	}


	function processSearchResults(response){
		totalCount = response.count;
		searchResults = response.data;
		sendGroupRequest(0);
	}


	function sendSearchRequest(params){
		$.getJSON('data/search.json', params).then(processSearchResults);
	}


	app.loadData = function(params){
		$.when(params, ready).then(sendSearchRequest);
	};

});

