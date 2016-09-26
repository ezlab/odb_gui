
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



	function load(name, params){
		return $.getJSON(name, params).then(app.verifyResponse);
	}


	var chartData = {
		data: [],
		legend: []
	};

	app.loadChart = function(params){

		$('#content').html(app.templates.charts());

		data = load('compare', params).then(function(response){
			chartData = response;
			app.compareRender('.chart', chartData, app.compareConfig);
		});
	};


	$(function(){

		$('input[data-cfg]').each(function(){

			var field = $(this),
				name = field.attr('data-cfg');

			field.val(app.compareConfig[name]);

			field.keypress(function(){setTimeout(function(){
				app.compareConfig[name] = field.val();
				app.compareRender('.chart', chartData, app.compareConfig);
			}, 100)});
		});
	});

})();







