
var app = {};

(function(){

	var query = '',
		universal = '',
		singlecopy = '',
		level = '',
		species = [];

	app.query = function(text){
		query = text;
	};

	app.universal = function(value){
		universal = value;
	};

	app.singlecopy = function(value){
		singlecopy = value;
	};

	app.level = function(text){
		level = text;
	};

	app.species = function(array){
		species = array;
	};

})();

