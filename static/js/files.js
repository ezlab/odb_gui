
$(function(){

	if (!window.Flow){
		return;
	}

	var flow = new Flow({
		target: 'upload',
		chunkSize: 1024*1024,
		testChunks: true
	});

	window.flow = flow;


	var allowUpdates = true;

	app.uploadUpdates = function(value){
		allowUpdates = value;
		setTimeout(renderUpload, 100);
	};

	function renderUpload(){

		if (!allowUpdates){
			return;
		}

		flow.done = (flow.progress() == 1);

		$('#upload-box').html(app.templates.upload(flow));
	}

	function extractMessage(response){
		try {
			return JSON.parse(response).message || 'Server error';
		}
		catch(err){
			return response || 'Server error';
		}
	}

	flow.on('filesSubmitted', function(file) {
		flow.upload();
	});

	flow.on('fileError', function(file, message) {
		file.message = extractMessage(message);
	});

	flow.on('catchAll', renderUpload);


	function calc(obj, fn){
		return typeof(fn) == 'function' ? fn.call(obj) : fn;
	}

	var helpers = {

		moment: function(value, format){
			return moment(calc(this, value)).format(format);
		},

		duration: function(value, units){
			return value == Infinity ? 'unknown time' : moment.duration(calc(this, value), units).humanize();
		},

		numeral: function(value, format){
			return numeral(calc(this, value)).format(format);
		}
	};

	$.each(helpers, function(name, value){
		Handlebars.registerHelper(name, value);
	});


	var level;

	app.method('level', {}, function(value){
		level = value;
	});

	function triggerRun(){

		var file = $('input[name=selected-file]:checked').val(),
			node = app.getNode(level),
			levelName = node ? ' at ' + node.data.name + ' level' : '';

		if (!window.confirm('Do you really want to run analysis on ' + file + levelName + '?')){
			return;
		}

		$.post('run', {file: file, level: level});
	}


	function load(path){
		return $.getJSON(path).then(app.verifyResponse);
	}


	app.showFiles = function(){

		$('#summary').html('');
		$("#content").html('Loading..');

		$.when(load('files'), load('analyses')).then(function(files, analyses){

			$("#content").html(app.templates.files({
				files: files.data,
				analyses: analyses.data
			}));

			flow.assignBrowse($('#upload-button'));
			renderUpload();

			$('#run-button').on('click', triggerRun);
		});
	};

});

