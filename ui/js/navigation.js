
(function(){

	app.init = function(){
		window.setTimeout(function(){
			app.parseURL();
		}, 0);
	};

	app.parseURL = function(){

		if (location.search.length < 2){
			return app.loadPage('ui/pages/intro.html');
		}

		var params = {};

		location.search.replace(/(\w+)=([^&]*)/g, function(match, name, value){
			params[name] = decodeURIComponent(value);
		});

		if (params.keywords){
			app.setKeywords(params.keywords || '');
		}

		if (params.phyloprofile){
			app.setProfile(params.phyloprofile || '');
		}

		if (params.species){
			app.setSelection((params.species || '').split(','));
		}

		if (params.level){
			app.setLevel((params.level || ''));
		}

		if (params.page){
			app.loadPage('ui/pages/' + params.page + '.html');
		}
		else {
			app.loadData(params);
		}
	};

	app.loadPage = function(url){
		$("#content").load(url);
	};

	app.loadData = function(params){
		app.loadPage('ui/pages/data.html');
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

