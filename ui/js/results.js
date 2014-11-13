
$(function(){

	function path(name){
		return 'data/' + name + '.json';
	}

	var searchParams = {},
		searchResults = [],
		totalCount = 0,
		groupData = [],
		groupsRendered = 0;


	function load(name, params){
		return $.getJSON(path(name), params).then(app.verifyResponse);
	}


	function requestGroupData(i){

		var params1 = {
			id: searchResults[i],
			level: searchParams.level
		};

		var params2 = {
			id: searchResults[i],
			level: searchParams.level,
			species: searchParams.species
		};

		var data = {
			group: load('group', params1),
			orthologs: load('orthologs', params2),
			siblings: load('siblings', params1)
		}

		groupData[i] = data;

		return data;
	}


	function render(selector, template, data){
		$(selector).html(template(data));
	}


	function renderGroup(i, selector, data){

		var ready = $.when(selector, app.templates.group, data.group).then(render);
		ready = $.when(selector + ' .orthologs', app.templates.orthologs, data.orthologs, ready).then(render);
		ready = $.when(selector + ' .siblings', app.templates.siblings, data.siblings, ready).then(render);

		if (++i < totalCount) { // preload next
			$.when(i, ready).then(requestGroupData);
		}
	}


	function showNextGroup(){

		var i = groupsRendered++,
			id = 'group' + i;

		$('#content').append(app.templates.placeholder({id:id}));

		renderGroup(i, '#' + id, groupData[i] || requestGroupData(i));
	}


	function processSearchResults(params, response){

		searchParams = params;
		searchResults = response.data;
		totalCount = response.count;
		groupData = [];
		groupsRendered = 0;

		var summary = {
			params: params,
			response: response
		};

		$('#summary').html(app.templates.summary(summary));
		$('#content').html('');

		showNextGroup();
	}


	app.loadData = function(params){
		$.when(params, load('search', params), app.ready).then(processSearchResults);
	};


	$('#content').on('scroll', function(){

		var remainingHeight = this.scrollHeight - this.offsetHeight - this.scrollTop;

		if (remainingHeight < 50 && groupsRendered < totalCount){
			showNextGroup();
		}
	});

});
