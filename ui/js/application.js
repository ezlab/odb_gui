
var app = {};

(function(){

	var keywords = '',
		profile = '',
		level = '',
		selection = [];

	app.keywords = function(text){
		keywords = text;
	};

	app.phyloprofile = function(text){
		profile = text;
	};

	app.level = function(text){
		level = text;
	};

	app.species = function(array){
		selection = array;
	};

})();

