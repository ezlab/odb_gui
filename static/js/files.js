
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

	function overlay(msg){
		$('#waiting').show();
		$('#waiting-message').text(msg);
	}


	$('#content').on('change', 'input[name=selected-file]:checked', function(){
		$('.s-run-file').val(selectedFile());
	});

	$('#content').on('change', 'input[name=selected-analysis]:checked', function(){
		$('.s-link-analysis').attr('href', 'analysis?id=' + selectedAnalysis());
	});


	$('#content').on('click', '#run-button', function(){

		var file = $('.s-run-file').val(),
			name = $('.s-run-species').val(),
			placeAt = $('.s-run-place-at').val();

		if (!speciesNames()){
			alert('Select 1 to 5 species from the right panel tree');
			return;
		}

		if (!name){
			alert('Please fill species name (required).');
			return;
		}

		if (!window.confirm('Do you really want to run analysis on ' + file + '?')){
			return;
		}

		overlay('Starting analysis on: ' + file);

		var params = {
			file: file,
			name: name,
			placeAt: placeAt,
			mapTo: level,
			species: (species || []).join(',')
		};

		$.post('run', params).then(reload);
	});


	app.fileMakePublic = function(){

		var file = selectedFile();

		if (!window.confirm('Do you really want to make public the data in ' + file + '?')){
			return;
		}

		overlay('Making public: ' + file);

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

		overlay('Deleting file: ' + file);

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

		overlay('Deleting analysis: ' + id);

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

		var node = app.getNode(level);

		if (node){
			fillList('.s-run-place-at', level, node.data.name);
			$('.s-run-map-to').val(node.data.name);
		}
	}


	var lock = {},
		level,
		species;

	function speciesNames(){

		var i, node, names = [];

		if (!species || !Array.isArray(species)){
			return;
		}

		for(i=0; i<species.length; i++){
			node = app.getNode(species[i]);
			if (node){
			 	if (node.children){
			 		return;
			 	}
				names.push(node.data.name);
			}
		}

		if (names.length > 5){
			return;
		}

		return names.join(', ');
	}


	function setSpeciesMsg(){
		$('.s-button-msg').text(speciesNames() || 'Select 1 to 5 species from the right panel tree');
	}


	app.method('level', lock, function(value){
		level = value;
		fillPlaceAtList();
	});

	app.method('species', lock, function(keys){
		species = app.extractSpecies(keys, 5);
		setSpeciesMsg();
	});


	app.showFiles = function(){

		$('#summary').html('');
		$("#content").html('Loading..');

		$.when(load('files'), load('analyses')).then(function(files, analyses){

			$("#content").html(app.templates.files({
				files: files.data,
				analyses: analyses.data
			}));

			fillPlaceAtList();
			setSpeciesMsg();

			flow.assignBrowse($('#upload-button'));
			renderUpload();
		});
	};

});

