
(function(){

	var initialized;

	app.init = function(){

		initialized = true;

		window.setTimeout(function(){
			app.parseURL();
			app.readCookies();
		}, 0);
	};

	app.parseURL = function(){

		if (!initialized){
			return;
		}

		if (location.search.length < 2){
			return app.loadPage('static/pages/intro.html');
		}

		var params = {};

		location.search.replace(/(\w+)=([^&]*)/g, function(match, name, value){
			params[name] = decodeURIComponent(value);
		});

		if (params.query ||
			params.universal ||
			params.singlecopy ||
			params.species ||
			params.level){

			app.query(params.query || '');
			app.universal(params.universal || '');
			app.singlecopy(params.singlecopy || '');
			app.species(params.species ? params.species.split(',') : []);
			app.level((params.level || ''));

			app.loadData(params);
		}
		else if (params.page){
			app.loadPage('static/pages/' + params.page + '.html');
		}
		else {
			throw new Error('Unknown URL parameters');
		}
	};

	app.loadPage = function(url){
		$("#content").load(url);
	};


	app.navigate = function(url){
		window.location.href = url;
	};


	// IE8, IE9 do not support history API
	if (window.history && history.pushState){

		app.navigate = function(url){
			history.pushState({}, document.title, url);
			app.parseURL();
		};

		$(window).bind("popstate", function(event) {
			app.parseURL();
		});
	}

})();

