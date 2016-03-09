
(function(){

	$.ajaxSetup({
		dataType: 'text'
	});

	function path(name){
		return 'static/templates/' + name + '.html';
	}

	var templates = [
		'title',
		'files',
		'upload'
	];

	var links = {};

	var helpers = {

		clade: function (key) {
			var node = app.getNode(String(key));
			return node ? node.data.name : '';
		},

		plural: function (value, singular, plural, options) {
			return String(value) + ' ' + (value == 1 ? singular : plural);
		},

		link: function (){
			return new Handlebars.SafeString((links[this.type] || links.generic)(this));
		},

		add: function (value1, value2){
			return value1 + value2;
		},

		round: function(value, precision){
			return Number(value).toFixed(precision);
		},

		is:	function (value, test, options) {
			return value == test ? options.fn(this) : options.inverse(this);
		},

		gt:	function (value, test, options) {
			return value > test ? options.fn(this) : options.inverse(this);
		}

	};

	function arg1(value){
		return value;
	}

	function load(url){
		return $.get(url).then(arg1);
	}

	app.templates = {};

	function compileTemplate(name, source){
		app.templates[name] = Handlebars.compile(source);
	}

	$.each(helpers, function(name, value){
		Handlebars.registerHelper(name, value);
	});

	$.each(templates, function(index, name){
		app.ready = $.when(name, load(path(name))).then(compileTemplate);
	});

})();

