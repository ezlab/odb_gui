
(function(){

	app.compareConfig = {

		svgWidth: 900,
		svgHeight: 600,

		paddingLeft: 150,
		paddingRight: 150,
		paddingTop: 100,
		paddingBottom: 100,

		legendTop: 50,
		legendRight: 150,

		fractions: [],
	};


	if (window.d3){
		$.each(d3.schemeCategory10, function(index, color){
			app.compareConfig.fractions.push({
				color: color,
				pattern: 0
			});
		});

		app.compareConfig.fractions[0].pattern = 1;
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


		cfg.fractions.slice(0, response.legend.length).reverse().forEach(function(fraction, i){

			var size = 5,
				type = fraction.pattern;

			if (type){

				var t = textures.lines()
					.size(4)
					.strokeWidth(1)
					.background(fraction.color);

				svg.call(t);
				patterns[i] = t.url();
			}
			else {
				patterns[i] = fraction.color;
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
			.domain(data.map(function(d){return d.name}))
			.range([0, chartHeight])
			.padding(0.3);


		var xAxis = d3.axisBottom(xScale)
			.ticks(5, '.0f');


		chart.append('g')
			.attr('transform', translate(0, chartHeight))
			.call(xAxis)
			.attr('font-family', '')
			.attr('font-size', 12);

		var yAxis = d3.axisLeft(yScale)
			.tickSize(0);

		chart.append('g')
			.call(yAxis)
			.attr('font-family', '')
			.attr('font-size', 12);


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
			.attr('width', 250)
			.attr('height', patterns.length * 20 + 30)
			.style('stroke', '#ccc')
			.style('stroke-width', 1)
			.style('fill', '#fff');

		var item = legend.selectAll('.legend')
			.data(response.legend)
			.enter().append('g')
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







