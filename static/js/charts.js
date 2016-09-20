
(function(){

	if (!window.d3){
		return;
	}

	var initialized;

	app.init = function(){

		initialized = true;

		window.setTimeout(function(){
			app.parseURL();
		}, 0);
	};

	app.parseURL = function(){

		if (!initialized){
			return;
		}

		if (location.search.length < 2){
			document.title = 'OrthoDB';
			ga('send', 'pageview', location.pathname + location.search); // Google analytics
			return app.loadPage('static/pages/charts.html');
		}

		var params = {};

		location.search.replace(/(\w+)=([^&]*)/g, function(match, name, value){
			params[name] = decodeURIComponent(value);
		});

		if (params.species ||
			params.level){

			app.species(params.species ? params.species.split(',') : []);
			app.level(params.level || '');

			app.loadChart({
				level: params.level,
				species: params.species
			});
		}
		else if (params.page){
			app.loadPage('static/pages/' + params.page + '.html');
		}
		else if (params.back){
			return history.go(-1);
		}
		else {
			throw new Error('Unknown URL parameters');
		}

		document.title = app.templates.title(params);
		ga('send', 'pageview', location.pathname + location.search); // Google analytics
	};


	function renderChart(response, cfg){

		$('.chart').removeClass('s-chart-loading');

		var data = response.data,
			legend = response.legend;

		function translate(x, y){
			return 'translate(' + x + ',' + y + ')';
		}


		var svg = d3.select('.chart').html('').append('svg')
			.attr('version', 1.1)
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr('width', cfg.svgWidth)
			.attr('height', cfg.svgHeight);

		var defs = svg.append('defs');

		cfg.colors.slice(0, legend.length).reverse().forEach(function(color, i){

			var size = 5,
				type = cfg.patterns[legend.length-i-1];

			var pattern = defs.append('pattern')
				.attr('id', 'p' + i)
				.attr('width', size)
				.attr('height', size)
				.attr('patternUnits', 'userSpaceOnUse');

			pattern.append('rect')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', size)
				.attr('height', size)
				.style('stroke', 'none')
				.style('fill', color)

			if (type == 1){
				pattern.append('line')
				.attr('x1', 0)
				.attr('y1', size)
				.attr('x2', size)
				.attr('y2', 0)
				.style('stroke', '#000000')
			}

		});


		var chart = svg.append('g')
			.attr('transform', translate(cfg.paddingLeft, cfg.paddingTop));

		var chartWidth = cfg.svgWidth - cfg.paddingLeft - cfg.paddingRight,
			chartHeight = cfg.svgHeight - cfg.paddingTop - cfg.paddingBottom;


		var maxData = d3.max(data, function(d){
			return d3.max(d.fractions);
		});


		var xScale = d3.scaleLinear()
			.domain([0, maxData])
			.range([0, chartWidth]);

		var yScale = d3.scaleBand()
			.domain(d3.range(0, data.length))
			.range([0, chartHeight])
			.padding(0.3);


		var xAxis = d3.axisBottom(xScale)
			.ticks(5, '.0f');


		chart.append('g')
			.attr('class', 'x-axis')
			.attr('transform', translate(0, chartHeight))
			.call(xAxis);


		var bar = chart.selectAll('.bar')
			.data(data)
			.enter().append('g')
			.attr('transform', function(d, i){return translate(0, yScale(i))});


		var fraction = bar.selectAll('.fraction')
			.data(function(d){return d.fractions.reverse();})
			.enter().append('rect')
			.attr('width', xScale)
			.attr('height', yScale.bandwidth())
			.style('fill', function(d, i){return 'url(#p' + i + ')'});

	}


	function load(name, params){
		return $.getJSON(name, params).then(app.verifyResponse);
	}


	app.loadChart = function(params){

		$('#content').html(app.templates.charts());

		var cfg = {

			"svgWidth": 800,
			"svgHeight": 600,

			"paddingLeft": 100,
			"paddingRight": 100,
			"paddingTop": 100,
			"paddingBottom": 100,

			"colors": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
			"patterns": [1,0,0,0,0,0],

			"end" : true
		};

		data = load('compare', params);

		$.when(data, cfg, app.ready).then(renderChart);
	};

})();







