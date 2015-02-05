
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
			response.data.index = i;
			response.data.params = searchParams;
			return response;
		});

		// add group data into orthologs (for AAs !! formatting)
		data.orthologs = $.when(orthologs, group).then(function(orthologs, group){
			orthologs.group = group.data;
			orthologs.show_switch = (searchParams.species != searchParams.level);
			orthologs.show_selected = true;
			return orthologs;
		});

		data.siblings = siblings.then(function(response){

			response.index = i;

			if (response.data.length == 5){
				response.show_switch = true;
				response.show_all = true;
			}

			return response;
		});

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

	$('#summary').on('change', '#skip-multicopy', function(){
		var param = '&skipmulticopy=1',
			skip = $('#skip-multicopy').prop('checked'),
			url = $('#all-fasta').attr('href').replace(param, '');

		$('#all-fasta').attr('href', skip ? url + param : url);
	});

	$('#content').on('change', '.s-group-ortho-switch>input', function(){

		var i = parseInt(this.id.replace(/\D+/, '')),
			selector = '#group' + i + ' .orthologs';

		var params = {
			id: searchResults[i]
		};

		if (this.checked) {
			params.species = searchParams.species;
		}

		var orthologs = load('orthologs', params),
			group = groupData[i].group;

		var data = $.when(orthologs, group).then(function(orthologs, group){
			orthologs.group = group.data;
			orthologs.show_switch = true;
			orthologs.show_selected = !!params.species;
			return orthologs;
		});

		$.when(selector, app.templates.orthologs, data).then(render);
	});

	app.showAllSiblings = function(all, i){

		var selector = '#group' + i + ' .siblings';

		var params = {
			id: searchResults[i]
		};

		if (!all){
			params.limit = 5;
		}

		var data = load('siblings', params).then(function(response){

			response.index = i;

			if (response.data.length == 5){
				response.show_switch = true;
				response.show_all = true;
			}

			if (response.data.length > 5){
				response.show_switch = true;
				response.show_all = false;
			}

			return response;
		});

		$.when(selector, app.templates.siblings, data).then(render);
	};
});

