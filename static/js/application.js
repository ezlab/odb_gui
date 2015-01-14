
var app = {};

(function(){

	var query = '',
		profile = '',
		level = '',
		selection = [];

	app.query = function(text){
		query = text;
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

