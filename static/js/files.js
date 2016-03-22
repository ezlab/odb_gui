
$(function(){

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

		var q = {};

		q.sampleName = $('#sampleName').val();
		q.sampleType = $('#sampleType').val();
		q.technology = $('#technology').val();
		q.adapters = $('#adapters').val();

		flow.opts.query = q;
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


	app.showFiles = function(){

		$('#summary').html('');
		$("#content").html('Loading..');

		$.getJSON('files').then(app.verifyResponse).then(function(response){
			$("#content").html(app.templates.files(response));
			flow.assignBrowse($('#upload-button'));
			renderUpload();
		});
	};


	app.init();
});

