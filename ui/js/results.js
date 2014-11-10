
$(function(){

	var totalCount = 0,
		searchResults = [],
		groups = {};


	function renderGroup(data, id){
		$('#content').html(app.templates.group(data));
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
		$.when(params, app.ready).then(sendSearchRequest);
	};

});

