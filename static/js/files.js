
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


	function selectedFile(){
		return $('input[name=selected-file]:checked').val();
	}

	function selectedAnalysis(){
		return $('input[name=selected-analysis]:checked').val();
	}

	function reload(){
		top.location.reload();
	}


	$('#content').on('change', 'input[name=selected-file]:checked', function(){
		$('.s-run-file').val(selectedFile());
	});

	$('#content').on('change', 'input[name=selected-analysis]:checked', function(){
		$('.s-link-analysis').attr('href', 'analysis?id=' + selectedAnalysis());
	});


	$('#content').on('click', '#run-button', function(){

		var file = $('.s-run-file').val(),
			species = $('.s-run-species').val(),
			placeAt = $('.s-run-place-at').val(),
			mapTo = $('.s-run-map-to').val();

		if (!species){
			alert('Please fill species name (required).');
			return;
		}

		if (!window.confirm('Do you really want to run analysis on ' + file + '?')){
			return;
		}

		var params = {
			file: file,
			species: species,
			placeAt: placeAt,
			mapTo: mapTo
		};

		$.post('run', params).then(reload);
	});


	app.fileMakePublic = function(){

		var file = selectedFile();

		if (!window.confirm('Do you really want to make public the data in ' + file + '?')){
			return;
		}

		var params = {
			file: file,
			action: 'publish'
		};

		$.post('file', params).then(reload);
	};


	app.fileDelete = function(){

		var file = selectedFile();

		if (!window.confirm('Do you really want to delete ' + file + '?')){
			return;
		}

		var params = {
			file: file,
			action: 'delete'
		};

		$.post('file', params).then(reload);
	};


	app.analysisDelete = function(){

		var id = selectedAnalysis();

		if (!window.confirm('Do you really want to delete the selected analysis (' + id + ')?')){
			return;
		}

		var params = {
			id: id,
			action: 'delete'
		};

		$.post('analysis', params).then(reload);
	};


	function load(path, params){
		return $.getJSON(path, params).then(app.verifyResponse);
	}


	function fillList(selector, root, text){

		var list = $(selector).empty();

		if (text){
			list.append($("<option></option>").attr("value", root).text(text));
		}

		return load('tree', {format: 1, root: root}).then(function(response){
			$.each(response.data, function(index, item){
				list.append($("<option></option>").attr("value", item[0]).text(item[1]));
			});
		});
	}


	function fillPlaceAtList(){
		fillList('.s-run-place-at', 33208).then(fillMapToList);
	}


	function fillMapToList(){
		fillList('.s-run-map-to', $('.s-run-place-at').val(), $('.s-run-place-at option:selected').text());
	}


	$('#content').on('change', '.s-run-place-at', fillMapToList);


	app.showFiles = function(){

		$('#summary').html('');
		$("#content").html('Loading..');

		$.when(load('files'), load('analyses')).then(function(files, analyses){

			$("#content").html(app.templates.files({
				files: files.data,
				analyses: analyses.data
			}));

			fillPlaceAtList();

			flow.assignBrowse($('#upload-button'));
			renderUpload();
		});
	};

});

