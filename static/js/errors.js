
(function(){

	var errors = [];

	function err(s){
		errors.push(s);
	}

	app.restart = function(){
		if (location.search) {
			location.search = '';
		}
		else {
			location.reload();
		}
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


	app.error = function(message, title){

		err(title);
		err(message);
		err('');

		showErrors();
	};

	window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {

		err('<b>Script error</b>: ' + url + ' (' + lineNumber + (column ? ',' + column : '') + ')');
		err(errorMsg);
		err('');

		showErrors();
	};

	$(document).ajaxError(function(event, xhr, settings, error){

		err('<b>Network error</b>: cannot load ' + settings.url);
		err(xhr.statusText + ' (' + xhr.status + ')');
		err('');

		showErrors();
	});

	app.verifyResponse = function(response, status, xhr){

		if (response.status != 'ok'){

			var message = response.message || 'Unknown error',
				status = response.status || 'Status field is missing',
				title = '<b>Server error</b>: ' + this.url;

			app.error(message + ' (' + status + ')', title);
			throw new Error('Server error');
		}

		return response;
	};

})();

