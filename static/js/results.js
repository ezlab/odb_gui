
$(function(){

	function path(name){
		return name;
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

		var id = searchResults[i],
			data = {};

		var group = load('group', {
			id: id
		});

		var orthologs = load('orthologs', {
			id: id,
			species: searchParams.species
		});

		var siblings = load('siblings', {
			id: id,
			limit: 5
		});

		// add display index into group
		data.group = group.then(function(response){
			response.data.i = i;
			return response;
		});

		// add group data into orthologs (for AAs !! formatting)
		data.orthologs = $.when(orthologs, group).then(function(orthologs, group){
			orthologs.group = group.data;
			return orthologs;
		});

		data.siblings = siblings;

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

		return ready;
	}


	function showNextGroup(){

		var i = groupsRendered++,
			id = 'group' + i;

		$('#content').append(app.templates.placeholder({id:id}));

		var ready = renderGroup(i, '#' + id, groupData[i] || requestGroupData(i));

		if (++i < totalCount) { // preload next
			$.when(i, ready).then(requestGroupData);
		}
	}


	function processSearchResults(params, response){

		if (response.data && !response.count){
			response.count = response.data.length;
		}

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

		if (totalCount) {
			showNextGroup();
		}
	}


	app.loadData = function(params){

		params.skip = 0;
		params.limit = 100;

		$.when(params, load('search', params), app.ready).then(processSearchResults);
	};


	$('#content').on('scroll', function(){

		if (!$('#group0').length){
			return;
		}

		var remainingHeight = this.scrollHeight - this.offsetHeight - this.scrollTop;

		if (remainingHeight < 50 && groupsRendered < totalCount){
			showNextGroup();
		}
	});

	app.backToTop = function(){
		$('#content')[0].scrollTop = 0;
	};


	app.search = function(query){

		var cmp = [], params = {
			query: query,
			universal: searchParams.universal,
			singlecopy: searchParams.singlecopy,
			level: searchParams.level,
			species: searchParams.species
		}

		$.each(params, function(name, value){
			if (value) {
				cmp.push(name + '=' + encodeURIComponent(String(value)));
			}
		});

		var url = '?' + cmp.join('&');

		app.navigate(url);
	};
});

