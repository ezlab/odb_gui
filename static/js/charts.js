
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
		$('#series-selector').empty();

		data = load('compare', params).then(function(response){
			chartData = response;
			app.compareRender('.chart', chartData, app.compareConfig);
			createExportLinks();

			$.each(response.legend, function(index, item){
				$('#series-selector').append($("<option></option>").attr("value", index).text(item));
			});
		});
	};

	var palette = [
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
    ]

	$(function(){

		var selector = $('#series-selector'),
			cfg = app.compareConfig,
			updates = [];

		function render(){
			try {
				app.compareRender('.chart', chartData, cfg);
				localStorage.compareConfig = JSON.stringify(cfg);
				createExportLinks();
			}
			catch(err){
				// ignore
			}
		}

		function update(){
			$.each(updates, function(i, f){
				f();
			});
		}

		selector.change(update);

		$('input[data-cfg]').each(function(){

			var field = $(this),
				name = field.attr('data-cfg');

			updates.push(function(){
				field.val(cfg[name]);
			});

			field.keyup(function(){setTimeout(function(){
				cfg[name] = field.val();
				render();
			}, 100)});
		});


		$('input[data-series]').each(function(){

			var field = $(this),
				name = field.attr('data-series');

			if (name == 'color'){

				function change(color){
					var i = selector.val() || 0;
					cfg.series[i][name] = String(color);
					render();
				}

				field.spectrum({
					showInput: true,
					showPalette: true,
					showAlpha: true,
 					palette: palette,
					change: change
				});

				updates.push(function(){
					var i = selector.val() || 0;
					field.spectrum('set', cfg.series[i][name]);
				});

			}
			else {

				updates.push(function(){
					var i = selector.val() || 0;
					field.val(cfg.series[i][name]);
				});

				field.keyup(function(){setTimeout(function(){
					var i = selector.val() || 0;
					cfg.series[i][name] = field.val();
					render();
				}, 100)});
			}
		});


		$('select[data-series]').each(function(){

			var field = $(this),
				name = field.attr('data-series');

			updates.push(function(){
				var i = selector.val() || 0;
				field.val(cfg.series[i][name]);
			});

			field.change(function(){
				var i = selector.val() || 0;
				cfg.series[i][name] = field.val();
				render();
			});
		});

		update();
	});


	function createExportLinks(){

		try {

			var data = $('svg')[0].outerHTML,
				blob = new Blob([data], {type:"image/svg+xml;charset=utf-8"}),
				url = URL.createObjectURL(blob);

			$('#save-as-svg').attr('href', url);

			var image = new Image(),
				canvas = document.createElement('canvas'),
				context = canvas.getContext('2d');

			image.onload = function(){

				canvas.width = image.width;
				canvas.height = image.height;

				context.drawImage(image, 0, 0);

				$('#save-as-png').attr('href', canvas.toDataURL('image/png'));
			};


			image.src = url;
		}
		catch(err){
			// ignore
		}
	}


})();







