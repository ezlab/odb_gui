
(function(){

	$.ajaxSetup({
		dataType: 'text'
	});

	function path(name){
		return 'ui/templates/' + name + '.html';
	}

	var templates = [
		'placeholder',
		'group',
		'orthologs',
		'siblings',
		'summary'
	];

	var partials = [
		'link',
		'gene_onthologies',
		'interpro_domains',
		'gene_architecture',
		'phyletic_profile',
		'evolutionary_rate'
	];

	var helpers = {

		plural: function (value, singular, plural, options) {
			return String(value) + ' ' + (value == 1 ? singular : plural);
		},

		is:	function (value, test, options) {
			return value == test ? options.fn(this) : options.inverse(this);
		}
	};


	var ready = $.when(true);

	app.templates = {};

	function compileTemplate(name, source){
		app.templates[name] = Handlebars.compile(source);
	}

	function registerPartial(name, source){
		Handlebars.registerPartial(name, source);
	}

	function load(url){
		return $.get(url).then(function(value){
			return value;
		});
	}

	$.each(helpers, function(name, value){
		Handlebars.registerHelper(name, value);
	});

	$.each(partials, function(index, name){
		ready = $.when(name, load(path(name)), ready).then(registerPartial);
	});

	$.each(templates, function(index, name){
		ready = $.when(name, load(path(name)), ready).then(compileTemplate);
	});

	app.ready = ready;

})();

