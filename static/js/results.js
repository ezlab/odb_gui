
$(function(){

	var searchLimit = 100,
		searchParams = {},
		totalCount = 0,
		groupsRendered = 0,
		searchData = [],
		groupData = [],
		orthologsData = [],
		siblingsData = [];


	function load(name, params){
		return $.getJSON(name, params).then(app.verifyResponse);
	}


	function loadID(i){

		var params = searchParams,
			limit = searchLimit,
			offset = i % limit,
			page = Math.floor(i/limit),
			data = searchData[page];

		if (!data){
			params.skip = page * limit;
			data = load('search', params);
			searchData[page] = data;
		}

		return data.then(function(response){
			return response.data[offset];
		});
	}


	function loadOrthologs(i, selectedSpeciesOnly, group){

		var orthologs = orthologsData[i];

		if (!orthologs){

			orthologs = loadID(i).then(function(id){

				var params = {
					id: id
				};

				if (selectedSpeciesOnly){
					params.species = searchParams.species;
				}

				return load('orthologs', params);
			});

			orthologsData[i] = orthologs;
		}

		return orthologs;
	}


	function loadGroup(i, expanded){

		var group = groupData[i];

		if (!group){

			group = loadID(i).then(function(id){
				return load('group', {id: id});
			});

			groupData[i] = group;
		}

		// add display index into group
		return group.then(function(response){
			response.data.index = i;
			response.data.expanded = !!expanded;
			response.data.params = searchParams;
			return response;
		});
	}


	function render(selector, template, data){

		var html = template(data),
			keywords = (searchParams.query || '').replace(/\W+/g,'|').replace(/^\|/, '').replace(/\|$/, ''),
			expr = new RegExp('\\b(' + keywords + ')\\b(?![^<]*>)', 'gi');

		if (keywords) {
			html = html.replace(expr, function(full, value, right){
				return '<span class="s-keyword">' + value + '</span>';
			});
		}

		$(selector).html(html);
	}


	function renderSiblings(i){

	}

	function renderOrthologs(i){

	}


	function renderGroup(i, expanded){

		var selector = '#group' + i,
			template = app.templates.group,
			data = loadGroup(i, expanded);

		$.when(selector, template, data).then(render).then(function(){
			if(expanded){
				renderOrthologs(i);
				renderSiblings(i);
			}
		});
	}



	function renderSummary(response){

		totalCount = response.count;

		var summary = {
			params: searchParams,
			response: response
		};

		$('#summary').html(app.templates.summary(summary));
		$('#content').html('');
	}


	app.loadData = function(params){

		searchParams = params;
		totalCount = 0;
		groupsRendered = 0;
		searchData = [];
		groupData = [];
		orthologsData = [];
		siblingsData = [];

		$('#summary').html('');
		$('#content').html('Searching..');

		params.skip = 0;
		params.limit = searchLimit;

		searchData[0] = load('search', params);

		$.when(searchData[0], app.ready).then(renderSummary).then(checkScroll);
	};


	function checkScroll(){

		var content = $('#content')[0];

		while (groupsRendered < totalCount && content.scrollHeight - content.offsetHeight - content.scrollTop < 50){

			var i = groupsRendered++,
				data = {id: 'group' + i};

			$('#content').append(app.templates.placeholder(data));

			renderGroup(i, totalCount == 1);
		}
	}


	$('#content').on('scroll', function(){

		if ($('#group0').length){
			checkScroll();
		}
	});

});

