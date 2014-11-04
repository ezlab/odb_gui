
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
});

