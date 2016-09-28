
(function(){

	app.compareConfig = {

		svgWidth: 950,
		svgHeight: 600,

		paddingLeft: 150,
		paddingRight: 250,
		paddingTop: 100,
		paddingBottom: 100,

		legendTop: 50,
		legendRight: 50,

		series: [
			{color: '#6CA7DE', pattern: 'x', size: 7},
			{color: '#6CA7DE', pattern: '\\', size: 7},
			{color: '#B5A5D8', pattern: 'x', size: 7},
			{color: '#B5A5D8', pattern: '/', size: 7},
			{color: '#D7A5BD', pattern: '', size: 7},
			{color: '#EFE8FD', pattern: '', size: 7},
			{color: '#F2F2F2', pattern: '', size: 7},
			{color: '#F4F4F4', pattern: '', size: 7},
			{color: '#F8F8F8', pattern: '', size: 7},
			{color: '#FFFFFF', pattern: '', size: 7}
		],

		version: 1
	};


	if (window.localStorage && localStorage.compareConfig){

		var prevCfg = JSON.parse(localStorage.compareConfig);

		if (prevCfg.version == 1){
			app.compareConfig = prevCfg;
		}
	}

	app.compareRender = function(selector, response, cfg){

		$(selector).removeClass('s-chart-loading').html('');

		var data = response.data,
			patterns = [];

		function translate(x, y){
			return 'translate(' + x + ',' + y + ')';
		}


		var svg = d3.select(selector).append('svg')
			.attr('version', 1.1)
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr('width', cfg.svgWidth)
			.attr('height', cfg.svgHeight);


		cfg.series.slice(0, response.legend.length).reverse().forEach(function(fraction, i){

			var t;

			switch(fraction.pattern){

				case '/':  t = textures.lines().orientation('2/8'); break;
				case '\\': t = textures.lines().orientation('6/8'); break;
				case '|':  t = textures.lines().orientation('vertical'); break;
				case '-':  t = textures.lines().orientation('horizontal'); break;
				case 'x':  t = textures.lines().orientation('2/8', '6/8'); break;
				case '+':  t = textures.lines().orientation('vertical', 'horizontal'); break;

				case 'squares':  t = textures.paths().d('squares'); break;
				case 'nylon':    t = textures.paths().d('nylon'); break;
				case 'waves':    t = textures.paths().d('waves'); break;
				case 'woven':    t = textures.paths().d('woven'); break;
				case 'crosses':  t = textures.paths().d('crosses'); break;
				case 'caps':     t = textures.paths().d('caps'); break;
				case 'hexagons': t = textures.paths().d('hexagons'); break;

				default:
					patterns[i] = fraction.color;
					return;
			}

			t.size(fraction.size);
			t.strokeWidth(1);
			t.background(fraction.color);

			svg.call(t);
			patterns[i] = t.url();
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
			.domain(data.map(function(d){return d.name}))
			.range([0, chartHeight])
			.padding(0.3);


		var xAxis = d3.axisBottom(xScale)
			.ticks(5, '.0f');


		chart.append('g')
			.attr('transform', translate(0, chartHeight))
			.call(xAxis)
			.attr('font-family', '')
			.attr('font-size', 11);

		var yAxis = d3.axisLeft(yScale)
			.tickPadding(8)
			.tickSize(0);

		chart.append('g')
			.call(yAxis)
			.attr('font-family', '')
			.attr('font-style', 'italic')
			.attr('font-size', 11);


		var bar = chart.selectAll('.bar')
			.data(data)
			.enter().append('g')
			.attr('transform', function(d, i){return translate(0, yScale(d.name))});


		var fraction = bar.selectAll('.fraction')
			.data(function(d){return d.fractions.concat().reverse();})
			.enter().append('rect')
			.attr('width', xScale)
			.attr('height', yScale.bandwidth())
			.style('fill', function(d, i){return patterns[i]});


		var legend = chart.append('g')
			.attr('transform', translate(chartWidth - cfg.legendRight, cfg.legendTop));

		legend.append('rect')
			.attr('x', -15.5)
			.attr('y', -15.5)
			.attr('width', 200)
			.attr('height', patterns.length * 20 + 30)
			.style('stroke', '#ccc')
			.style('fill', '#fff');

		var item = legend.selectAll('.legend')
			.data(response.legend)
			.enter().append('g')
			.attr('font-size', 11)
			.attr('transform', function(d, i){return translate(0, i*20)});

		item.append('text')
			.html(function(d){return d})
			.attr('transform', function(d, i){return translate(30, 12)});

		item.append('rect')
			.attr('width', 15)
			.attr('height', 15)
			.style('fill', function(d, i){return patterns[patterns.length - 1 - i]});

	}

})();







