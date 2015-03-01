
(function(){

	$.ajaxSetup({
		dataType: 'text'
	});

	function path(name){
		return 'static/templates/' + name + '.html';
	}

	var templates = [
		'tree',
		'selection',
		'placeholder',
		'group',
		'orthologs',
		'siblings',
		'summary',
		'title'
	];

	var partials = [
		'gene_onthologies',
		'interpro_domains',
		'functional_category',
		'gene_architecture',
		'phyletic_profile',
		'evolutionary_rate'
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

	helpers.phyloprofile = function(value){
		switch(String(value)){
			case '1': return 'all';
			case '0.9': return '>90%';
			case '0.8': return '>80%';
		}
		return value;
	};

	helpers.deviation = function(value, median, stdev){

		var cls = 'm', delta = value - median;

		if (delta > stdev) {cls = 'g1';}
		if (delta > 2*stdev) {cls = 'g2';}
		if (delta < -stdev) {cls = 'l1';}
		if (delta < -2*stdev) {cls = 'l2';}

		return new Handlebars.SafeString('<span class="s-deviation-' + cls + '">' + value + '</span>');
	};

	helpers.rainbow = function(value){

		var steps = [0, 0.4, 0.55, 0.65, 0.75, 0.85, 0.9, 1.1, 1.2, 1.3, 1.5, 1.7, 1.9, Infinity];

		var	i, s = '', x, v = Number(value), count = steps.length - 1;

		for(i=0; i<count; i++){
			x = (v > steps[i] && v <= steps[i+1]) ? ' s-rainbow-mark' : '';
			s += '<span class="s-rainbow s-rainbow-' + i + x + '"></span>';
		}

		return new Handlebars.SafeString(s);
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

