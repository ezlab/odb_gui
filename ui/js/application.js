
$(function(){

	window.app = {};

	var keywords = '',
		profile = '',
		level = '',
		selection = [];

	app.setKeywords = function(text){
		keywords = text;
	};

	app.setProfile = function(text){
		profile = text;
	};

	app.setLevel = function(text){
		level = text;
	};

	app.setSelection = function(array){
		selection = array;
	};

	app.getState = function(){
		return {
			keywords: keywords,
			profile: profile,
			level: level,
			selection: selection
		};
	};

	app.init = function(){
		window.setTimeout(function(){
			app.parseURL();
		}, 0);
	};

	app.parseURL = function(){

		if (location.search.length < 2){
			return app.loadPage('ui/pages/intro.html');
		}

		var params = {};

		location.search.replace(/(\w+)=([^&]*)/g, function(match, name, value){
			params[name] = decodeURIComponent(value);
		});

		if (params.keywords){
			app.setKeywords(params.keywords || '');
		}

		if (params.phyloprofile){
			app.setProfile(params.phyloprofile || '');
		}

		if (params.species){
			app.setSelection((params.species || '').split(','));
		}

		if (params.level){
			app.setLevel((params.level || ''));
		}

		if (params.page){
			app.loadPage('ui/pages/' + params.page + '.html');
		}
		else {
			app.loadData(params);
		}
	};

	app.loadPage = function(url){

		var box = $("#content");

		function ok(content){
			box.html(content);
		}

		function err(xhr, status){
			box.html(status);
		}

		$.get(url).then(ok, err);
	};

	app.loadData = function(params){
		app.loadPage('ui/pages/data.html');
	};
});

