
(function(){

	$.ajaxSetup({
		dataType: 'text'
	});

	function path(name){
		return 'ui/templates/' + name + '.html';
	}

	var templates = [
		'tree',
		'selection',
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

		clade: function (key) {
			return app.getNode(key).data.name;
		},

		plural: function (value, singular, plural, options) {
			return String(value) + ' ' + (value == 1 ? singular : plural);
		},

		link: function (){
			return links[this.type] ? new Handlebars.SafeString(links[this.type](this)) : this.id;
		},

		add: function (value1, value2){
			return value1 + value2;
		},

		is:	function (value, test, options) {
			return value == test ? options.fn(this) : options.inverse(this);
		},

		gt:	function (value, test, options) {
			return value > test ? options.fn(this) : options.inverse(this);
		}

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

		var i, s = '', x, min, max, count = 13, step = 2*Math.log(2)/(count-1);

		for(i=0; i<count; i++){
			min = (i === 0) ? -Infinity : (i - count/2)*step;
			max = (i == count-1) ? Infinity : (i + 1 - count/2)*step;
			x = (Math.log(value) >= min && Math.log(value) < max) ? ' s-rainbow-mark' : '';
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

