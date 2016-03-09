
var app = {};

(function(){

	var mode = '',
		query = '',
		universal = '',
		singlecopy = '',
		sequence = '',
		level = '',
		species = [];

	app.mode = function(text){
		mode = text;
	};

	app.query = function(text){
		query = text;
	};

	app.universal = function(value){
		universal = value;
	};

	app.singlecopy = function(value){
		singlecopy = value;
	};

	app.sequence = function(text){
		sequence = text;
	};

	app.level = function(text){
		level = text;
	};

	app.species = function(array){
		species = array;
	};

})();

