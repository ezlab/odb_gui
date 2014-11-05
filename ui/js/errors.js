
(function(){

	var errors = [];

	function err(s){
		errors.push(s);
	}

	app.restart = function(){
		location.search = '';
		window.setTimeout(function(){
			location.reload();
		}, 100);
	};


	function showErrors(){

		var box = document.getElementById('error');

		if (!box){
			window.setTimeout(showErrors, 1000);
			return;
		}

		box.style.display = 'block';

		var msg = document.getElementById('error-message');

		if (msg){
			msg.innerHTML = errors.join('<br>');
		}
	};


	window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {

		err('script: ' + url + ' (' + lineNumber + (column ? ',' + column : '') + ')');
		err(errorMsg);
		err('');

		showErrors();
	}

	$(document).ajaxError(function(event, xhr, settings, error){

		err('Network error. Cannot load ' + settings.url);
		err(xhr.statusText + ' (' + xhr.status + ')');
		err('');

		showErrors();
	});

})();

