
$(function(){

	var searchLimit = 100,
		searchParams = {},
		totalCount = 0,
		groupsRendered = 0,
		searchData = [],
		groupData = [];


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
			data = load(params.seq ? 'blast' : 'search', params);
			searchData[page] = data;
		}

		return data.then(function(response){
			return response.data[offset];
		});
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


	function loadOrthologs(i, showAll){

		var orthologs = loadID(i).then(function(id){

			var params = {
				id: id
			};

			if (!showAll){
				params.species = searchParams.species;
			}

			return load('orthologs', params);
		});

		var group = loadGroup(i, true);

		// add group data into orthologs (for AAs !! formatting)
		return $.when(orthologs, group).then(function(orthologs, group){
			orthologs.group = group.data;
			orthologs.params = searchParams;
			orthologs.show_switch = (searchParams.species != searchParams.level);
			orthologs.show_selected = !showAll;
			return orthologs;
		});
	}


	function loadSiblings(i, showAll){

		var siblings = loadID(i).then(function(id){

			var params = {
				id: id
			};

			if (!showAll){
				params.limit = 5;
			}

			return load('siblings', params);
		});

		// add index and all/top5 state
		return siblings.then(function(response){

			response.index = i;
			response.params = searchParams;
			response.show_switch = (response.data.length >= 5);
			response.show_all = !showAll;

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


	function renderOrthologs(i, showAll){

		var selector = '#group' + i + ' .orthologs',
			template = app.templates.orthologs,
			data = loadOrthologs(i, showAll);

		$.when(selector, template, data).then(render);
	}


	function renderSiblings(i, showAll){

		var selector = '#group' + i + ' .siblings',
			template = app.templates.siblings,
			data = loadSiblings(i, showAll);

		$.when(selector, template, data).then(render);
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
			url: String(location.href).replace(/\?.*/, ''),
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

		$('#summary').html('');
		$('#content').html('Searching..');

		params.skip = 0;
		params.limit = searchLimit;

		searchData[0] = load(params.seq ? 'blast' : 'search', params);

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


	$('#content').on('change', '.s-group-ortho-switch>input', function(){
		var i = parseInt(this.id.replace(/\D+/, '')), showAll = !this.checked;
		renderOrthologs(i, showAll);
	});


	$('#content').on('click', '.s-group-collapsed', function(){
		var i = parseInt(this.parentNode.id.replace(/\D+/, ''));
		renderGroup(i, true);
	});


	app.showSiblings = function(i, showAll){
		renderSiblings(i, showAll);
	};

	app.showGroup = function(i, expand){
		renderGroup(i, expand);
	};


	function splitXRefs(data){

		var i, link, type, section, xrefs = data.xrefs;

		if (xrefs){

			for(i=0; i<xrefs.length; i++){

				link = xrefs[i];
				type = link.type;
				section = data[type];

				if (!section || !section.splice){
					section = [];
					data[type] = section;
				}

				section.push(link);
			}

			delete data.xrefs;
		}
	}

	function renderAnnotations(tpl, data){

		var exclude = {
			gene_id: true,
			interpro: true,
			aas: true,
			exons: true
		};

		var i, s = '';

		for (i in data){
			if (exclude[i]){
				delete data[i];
			}
		}

		splitXRefs(data);

		return tpl(data);
	}


	app.showAnnotations = function(id, event){

		var src = event.target || event.srcElement;

		if (src && src.href) {
			return;
		}

		var $element = $(src).closest('.s-group-ortho-gene'),
			cls = 's-group-ortho-expanded';

		if ($element.hasClass(cls)){
			$element.removeClass(cls);
			return;
		}

		$element.addClass(cls);

		var template = app.templates.annotations,
			data = load('ogdetails', {id:id});

		$.when(template, data).then(function(tpl, response){
			$element.find('.s-group-ortho-annotations').css('background', 'none').html(renderAnnotations(tpl, response.data));
		});
	};

});

