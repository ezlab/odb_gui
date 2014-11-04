
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
	};
});

