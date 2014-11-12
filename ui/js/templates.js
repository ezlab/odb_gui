
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
		'gene_onthologies',
		'interpro_domains',
		'gene_architecture',
		'phyletic_profile',
		'evolutionary_rate'
	];

	var links = {};

	var helpers = {

		plural: function (value, singular, plural, options) {
			return String(value) + ' ' + (value == 1 ? singular : plural);
		},

		link: function (){
			return links[this.type] ? new Handlebars.SafeString(links[this.type](this)) : this.id;
		},

		is:	function (value, test, options) {
			return value == test ? options.fn(this) : options.inverse(this);
		}
	};

	function arg1(value){
		return value;
	}

	function load(url){
		return $.get(url).then(arg1);
	}

	function registerLink(line, name, source){
		links[name] = Handlebars.compile(source);
	}

	var ready = load(path('link')).then(function(src){
		src.replace(/^\s*(\w+)\s*:\s*(.+)\s*$/gm, registerLink);
	});

	app.templates = {};

	function compileTemplate(name, source){
		app.templates[name] = Handlebars.compile(source);
	}

	function registerPartial(name, source){
		Handlebars.registerPartial(name, source);
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

