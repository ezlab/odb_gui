
$(function(){

	function path(name){
		return 'data/' + name + '.json';
	}

	var totalCount = 0,
		searchResults = [],
		groups = {},
		when = $.when;


	function verifyResponse(response, status, xhr){

		if (response.status != 'ok'){

			var message = response.message || 'Unknown error',
				status = response.status || 'Status field is missing',
				title = '<b>Server error</b>: ' + this.url;

			app.error(message + ' (' + status + ')', title);
			throw new Error('Server error');
		}

		return response;
	}

	function load(name, params){
		return $.getJSON(path(name), params).then(verifyResponse);
	}

	function renderGroup(data, id){
		$('#content').html(app.templates.group(data));
	}

	function processGroupData(response){
			var group = response.data, id = group.id;
			groups[id] = group;
			renderGroup(group, id);
	}


	function sendGroupRequest(i){
		load('group', {id:searchResults[i]}).then(processGroupData);
	}


	function processSearchResults(response){
		totalCount = response.count;
		searchResults = response.data;
		sendGroupRequest(0);
	}


	function sendSearchRequest(params){
		load('search', params).then(processSearchResults);
	}


	app.loadData = function(params){
		when(params, app.ready).then(sendSearchRequest);
	};

});

